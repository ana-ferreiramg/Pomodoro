const btnContinue = document.querySelector('#div_btn_continue button');

btnContinue.addEventListener('click', () => {
  let workTime = document.getElementById('working_time').value;
  let breakTime = document.getElementById('breaking_time').value;
  let sessions = document.getElementById('number_sessions').value;

  window.location.href = `?working_time=${workTime}&breaking_time=${breakTime}&number_sessions${sessions}`;
});

const setTime = {
  add(value) {
    return (value += 1);
  },

  sub(value) {
    return (value -= 1);
  },
};

class PomodoroSetTime {
  constructor() {
    this.inputWorkTime = document.getElementById('working_time');
    this.inputBreakTime = document.getElementById('breaking_time');
    this.inputNumberSessions = document.getElementById('number_sessions');

    this.add();
    this.sub();
  }

  add() {
    const btnsAdd = document.querySelectorAll('.btn-add');

    btnsAdd.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        let { workTime, breakTime, sessions } = this.getTimes();
        if (index === 0) return (this.inputWorkTime.value = setTime.add(workTime));
        if (index === 1) return (this.inputBreakTime.value = setTime.add(breakTime));
        if (index === 2) return (this.inputNumberSessions.value = setTime.add(sessions));
      });
    });
  }

  sub() {
    const btnsSub = document.querySelectorAll('.btn-sub');

    btnsSub.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        let { workTime, breakTime, sessions } = this.getTimes();
        if (index === 0) return workTime > 1 ? (this.inputWorkTime.value = setTime.sub(workTime)) : 0;
        if (index === 1) return breakTime > 1 ? (this.inputBreakTime.value = setTime.sub(breakTime)) : 0;
        if (index === 2) return sessions > 1 ? (this.inputNumberSessions.value = setTime.sub(sessions)) : 0;
      });
    });
  }

  getTimes() {
    let workTime = Number(this.inputWorkTime.value);
    let breakTime = Number(this.inputBreakTime.value);
    let sessions = Number(this.inputNumberSessions.value);

    return { workTime, breakTime, sessions };
  }
}
const pomodoro = new PomodoroSetTime();
