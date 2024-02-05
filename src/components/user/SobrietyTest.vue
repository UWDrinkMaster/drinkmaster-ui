<template>
  <div>
    <el-button size="mini" @click="openGame" v-if="!testStarted" round>Order</el-button>

    <el-dialog
      :visible.sync="dialogVisible"
      title="Sobriety Test"
      @close="handleClose"
      :modalAppendToBody="false"
      center fullscreen>
        <div v-if="!testStarted && !drunk" style="text-align: center;">
          <p>Please complete the following test to ensure that you are suitable to order more drinks.</p>
          <p>There will be 25 circles that appear on your screen. Draw lines to connect the circles in ascending order from 1 to 25 as quickly as possible.</p>
          <p>Click the "Start Test" button when you are ready.</p>
          <el-button @click="startTest" v-if="!testStarted">Start Test</el-button>
        </div>

        <div v-if="!testStarted && drunk" style="text-align: center;">
          <p>You previously failed the test and have been deemed unsuitable for more drinks.</p>
          <p>Please wait {{ (Math.round(timeLeft * 100) / 100).toFixed(2) }} minutes before attempting the test again.</p>
          <el-button @click="handleClose">Close</el-button>
        </div>

        <div v-if="testStarted && !testFinished">
          <div class="timer">
            {{ time.toFixed(2) }}
          </div>
          <canvas ref="canvas" class="drawing-canvas" 
          @mousedown="handleMouseDown" 
          @mouseup="handleMouseUp" 
          @mousemove="handleMouseMove"></canvas>
          
          <div v-if="countdownStarted" class="countdown">
            {{ countdown }}
          </div>

          <div class="game-container">
            <div v-for="circle in shuffledCircles" 
            :key="circle.id" 
            class="circle" 
            :style="{ top: circle.top + 'px', left: circle.left + 'px', backgroundColor: circle.completed ? '#2ecc71' :'#ffffff' }"
            @mouseover="circleHover(circle)"
            @touchstart="circleHover(circle)">
              {{ circle.number }}
            </div>
          </div>
        </div>

        <div v-if="testFinished" style="text-align: center;">
          <p>You finished the test in {{ (Math.round(time * 100) / 100).toFixed(2) }} seconds.</p>
          <!-- add logic here to check if greater than the pass fail time for each user -->
          <div v-if="time < 45">
            <p>Congratulations, you passed the test. You may proceed with ordering drinks. Enjoy!</p>
          </div>
          <div v-else>
            <p>Unforunately, you failed the test. Please wait until you are sober before trying the test again.</p>
          </div>
          <el-button @click="handleFinish">Finish</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogVisible: false,
      testStarted: false,
      testFinished: false,
      circles: Array.from({ length: 25 }, (_, index) => ({ id: index + 1, number: index + 1, top: 0, left: 0, completed: false })),
      drawing: false,
      containerWidth: 0,
      containerHeight: 0,
      canvasContext: null,
      expectedCircleNumber: 1,
      lineSegments: [],
      currentLineSegment: [],
      time: 0,
      shuffledCircles: [],
      countdownStarted: false,
      countdown: 3,
      drawingEnabled: false,
      drunk: false,
      timeLeft: 0
    };
  },
  mounted() {
    this.updateContainerDimensions();
    window.addEventListener('resize', this.updateContainerDimensions);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateContainerDimensions);
  },
  methods: {
    openGame() {
      // make an API call to check the last score
      this.$userApi.getUser(this.$store.getters.getUser.id).then(res => {
        if (res.status === 200) {
            // check last score and last time
            let last_test_time = res.data.last_sobriety_test_at
            let last_test_score = res.data.last_sobriety_test_score
            console.log (last_test_score, last_test_time)
            if (last_test_score > 45 && last_test_score < 78 && !this.hasTimePassed(last_test_time, 15)) {
              this.drunk = true;
              this.timeLeft = this.getTimeDiff(last_test_time, 15);
              this.dialogVisible = true;
              return;
            } else if (last_test_score > 78 && !this.hasTimePassed(last_test_time, 30)) {
              this.drunk = true;
              this.timeLeft = this.getTimeDiff(last_test_time, 30);
              this.dialogVisible = true;
              return;
            } else if (last_test_score < 45 && !this.hasTimePassed(last_test_time, 15)) { 
              //allow the user to bypass the test if they passed 15 mins ago
              this.$emit('testFinished', { passed: true });
              this.closeDialog()
              return;
            }
            this.drunk = false;
            this.dialogVisible = true;
            this.shuffledCircles = this.shuffleCircles()
            this.countdown = 3;
          }
      }).catch(err => {
        console.log(err.response);
        this.$message.error(err.response.data.message);
      });
    },
    startCountdown() {
      this.countdownStarted = true;
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.countdownStarted = false;
          this.drawingEnabled = true;
          this.startTimer(); // start the timer once the countdown is done
        }
      }, 1000);
    },
    startTest() {
      this.testStarted = true;
      this.expectedCircleNumber = 1;
      this.$nextTick(() => {
        this.initializeCanvas();
      });
      this.startCountdown();
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.time += 0.01;
      }, 10);
    },

    closeDialog() {
      clearInterval(this.timerInterval);
      this.dialogVisible = false;
      this.testStarted = false;
      this.testFinished = false;
      this.time = 0;
      this.countdownStarted = false;
      this.lineSegments = [];
      this.currentLineSegment = [];
    },
    updateContainerDimensions() {
      this.containerWidth = window.innerWidth;
      this.containerHeight = window.innerHeight;
    },
    assignRandomPositions(circles) {
      const containerWidth = this.containerWidth - 45; //ensure circles do not appear offscreen
      const containerHeight = this.containerHeight-130;
      const circleDiameter = 40;

      circles.forEach(circle => {
        circle.completed = false;
        let collision = true;
        while (collision) {
          // Assign random positions
          circle.top = Math.max(0, Math.min(containerHeight - circleDiameter, Math.floor(Math.random() * containerHeight)));
          circle.left = Math.max(0, Math.min(containerWidth - circleDiameter, Math.floor(Math.random() * containerWidth)));

          // Check for collisions with other circles
          collision = circles.some(otherCircle => {
            if (otherCircle !== circle) {
              const dx = circle.left - otherCircle.left;
              const dy = circle.top - otherCircle.top;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < circleDiameter + 10;
            }
            return false;
          });
        }
      });
    },
    shuffleCircles() {
      const shuffled = [...this.circles];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.assignRandomPositions(shuffled);
      return shuffled;
    },
    handleMouseDown() {
      if (this.drawingEnabled) {
        this.drawing = true;
        this.currentLineSegment = [];
        this.canvasContext.beginPath();
      }
    },
    circleHover(circle) {
      if (circle.number === this.expectedCircleNumber) {
        circle.completed = true; // mark circles as completed

        this.expectedCircleNumber++;

        if (this.currentLineSegment.length > 0) {
          this.lineSegments.push([...this.currentLineSegment]);
          this.currentLineSegment = []; // clear the current line segment after storing it
        }

        if (this.expectedCircleNumber > this.shuffledCircles.length) {
          this.handleGameCompletion();
        }
      } else {
        this.clearLineSegment();
      }
    },
    handleMouseUp() {
      if (this.drawingEnabled) {
        this.drawing = false;
        if (this.canvasContext && this.currentLineSegment.length > 0) {
          // Store the current line segment when the mouse is released
          this.lineSegments.push([...this.currentLineSegment]);
        }
      }
    },
    handleMouseMove(event) {
      if (this.drawing && this.canvasContext && this.drawingEnabled) {
        const rect = this.$refs.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;  //WHY DO WE SUBTRACT THE RECT FROM THIS?

        this.canvasContext.lineTo(x, y);
        this.canvasContext.stroke();
        this.currentLineSegment.push({ x, y });
      }
    },
    clearLineSegment() {
      if (this.canvasContext && this.lineSegments.length > 0) {
        // Clear the entire canvas
        const canvas = this.$refs.canvas;
        this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        this.canvasContext.closePath();
        this.currentLineSegment = []
        
        // Redraw the saved line segments
        this.lineSegments.forEach(segment => {
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(segment[0].x, segment[0].y);

          for (const point of segment) {
            this.canvasContext.lineTo(point.x, point.y);
          }

          this.canvasContext.stroke();
        });
      }
    },
    handleGameCompletion() {
      clearInterval(this.timerInterval);

      // Record the final time
      const finalTime = this.time;
      this.$userApi.updateSobrietyScore(finalTime, this.$store.getters.getUser.id).then(res => {
        console.log(res)
      }).catch(err => {
        this.$message.error(err.response.data.message)
      })

      this.testFinished = true;
    },
    handleFinish() {
      const finalTime = this.time;
      this.$emit('testFinished', { passed: finalTime < 60 });
      this.closeDialog()
    },
    handleClose() {
      this.$emit('testFinished', { passed: false });
      this.closeDialog()
    },
    initializeCanvas() {
      const canvas = this.$refs.canvas;
      if (canvas) {
        this.canvasContext = canvas.getContext('2d');
        canvas.width = this.containerWidth;
        canvas.height = this.containerHeight - 100;
        this.canvasContext.strokeStyle = '#000'; // Set stroke color
        this.canvasContext.lineWidth = 2; // Set line width
      }
    },
    hasTimePassed(timestamp, minutesPassed) {
      // Current time
      const now = new Date();
      const givenTime = new Date(timestamp);
      const difference = now - givenTime;

      //minutes in milliseconds
      const minutes = minutesPassed * 60 * 1000;

      return difference > minutes;
    },
    getTimeDiff(timestamp, minutesPassed){
      const now = new Date();
      const givenTime = new Date(timestamp);
      const difference = now - givenTime;

      //minutes in milliseconds
      const minutes = minutesPassed * 60 * 1000;

      return (minutes - difference)/60/1000;
    }
  },
};
</script>

<style scoped>
.game-container {
  position: relative;
}
.circle {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  user-select: none;
}
.drawing-canvas {
  position: absolute;
  top: 100px;
  left: 0;
}
.timer {
  text-align: right;
  font-size: 40px;
  font-weight: bold;
  margin-top: 10px;
  margin-right: 10px;
  user-select: none;
}
.countdown {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  font-weight: bold;
}
</style>