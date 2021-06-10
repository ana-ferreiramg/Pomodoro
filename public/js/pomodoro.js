class Pomodoro {
  constructor() {
    const { workTime, breakTime } = Utils.getValues();
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.secondsWork = 0;
    this.secondsBreak = 0;
    this.startWorkMinutes = 0;
    this.startBreakMinutes = 0;
  }

  startWork() {
    this.startWorkMinutes = setInterval(() => {
      if (this.secondsWork === 0) {
        this.secondsWork = 60;
        this.workTime -= 1;
      }

      this.secondsWork -= 1;
      App.show('work', this.workTime, this.secondsWork);

      if (this.secondsWork === 0 && this.workTime === 0) {
        DOM.sounds();
        DOM.playPauseIcon(DOM.btnWork);
        DOM.doneSessions('work');
        DOM.pomodoroHide();
        App.reset('work');
      }
    }, 1000);
  }

  startBreak() {
    this.startBreakMinutes = setInterval(() => {
      if (this.secondsBreak === 0) {
        this.secondsBreak = 60;
        this.breakTime -= 1;
      }

      this.secondsBreak -= 1;
      App.show('break', this.breakTime, this.secondsBreak);

      if (this.secondsBreak === 0 && this.breakTime === 0) {
        DOM.sounds();
        DOM.playPauseIcon(DOM.btnBreak);
        DOM.doneSessions('break');
        DOM.pomodoroHide();
        App.reset('break');
      }
    }, 1000);
  }
}

const Utils = {
  url: new URL(document.location).searchParams,

  zeroFill(n) {
    return ('0' + n).slice(-2);
  },

  getValues() {
    const workTime = Number(this.url.get('working_time'));
    const breakTime = Number(this.url.get('breaking_time'));
    const numberSessions = Number(this.url.get('number_sessions'));

    return { workTime, breakTime, numberSessions };
  },
};

const DOM = {
  btnWork: document.getElementById('btn-work'),
  btnBreak: document.getElementById('btn-break'),

  createSessions() {
    const sessionWork = document.getElementById('sessions-work');
    const sessionBreak = document.getElementById('sessions-break');
    let { numberSessions } = Utils.getValues();

    for (let i = 0; i < numberSessions; i++) {
      const spanWork = document.createElement('span');
      const spanBreak = document.createElement('span');
      spanWork.innerHTML = `.`;
      spanBreak.innerHTML = `.`;
      sessionWork.appendChild(spanWork);
      sessionBreak.appendChild(spanBreak);
    }
  },

  setClassSessions() {
    const spansWork = document.querySelectorAll('#sessions-work span');
    const spansBreak = document.querySelectorAll('#sessions-break span');

    for (let span of spansWork) {
      span.classList.add('work');
    }

    for (let span of spansBreak) {
      span.classList.add('break');
    }
  },

  doneSessions(session) {
    const spansWork = document.querySelectorAll('#sessions-work span');
    const spansBreak = document.querySelectorAll('#sessions-break span');
    let sessions;

    if (session === 'work') sessions = spansWork;
    if (session === 'break') sessions = spansBreak;

    for (let session of sessions) {
      if (!session.classList.contains('done')) {
        session.classList.add('done');
        break;
      }
    }
  },

  pomodoroHide() {
    const pomodoroWork = document.getElementById('time_work');
    const pomodoroBreak = document.getElementById('time_break');
    pomodoroWork.classList.toggle('hide');
    pomodoroBreak.classList.toggle('hide');
  },

  playPauseIcon(e) {
    const spansBreak = document.querySelectorAll('#sessions-break span');
    const index = spansBreak.length - 1;

    if (spansBreak[index].classList.contains('done')) return DOM.modalSessionsDone();
    if (e.classList.contains('play')) {
      e.classList.remove('play');
      e.classList.add('pause');
      e.innerHTML = `<i class="fas fa-pause"></i>`;

      if (e.classList.contains('btn-work')) {
        App.init('work');
        DOM.btnWork.title = 'Pause';
      }

      if (e.classList.contains('btn-break')) {
        App.init('break');
        DOM.btnBreak.title = 'Pause';
      }

      return;
    }

    if (e.classList.contains('pause')) {
      e.classList.remove('pause');
      e.classList.add('play');
      e.innerHTML = `<i class="fas fa-play"></i>`;

      if (e.classList.contains('btn-work')) {
        App.pause('work');
        DOM.btnWork.title = 'Play';
      }

      if (e.classList.contains('btn-break')) {
        App.pause('break');
        DOM.btnBreak.title = 'Play';
      }

      return;
    }
  },

  modalSessionsDone() {
    const modal = document.querySelector('.modal-overlay');
    modal.classList.toggle('active');
  },

  sounds() {
    const audio = document.querySelector('audio');
    audio.play();
  },

  initialPomodoro() {
    let { workTime, breakTime } = Utils.getValues();

    App.pomodoroTimeWork.value = `${Utils.zeroFill(workTime)}:00`;
    App.pomodoroTimeBreak.value = `${Utils.zeroFill(breakTime)}:00`;

    DOM.btnWork.innerHTML = `<i class="fas fa-play"></i>`;
    DOM.btnWork.title = 'Play';
    DOM.btnBreak.innerHTML = `<i class="fas fa-play"></i>`;
    DOM.btnBreak.title = 'Play';
  },
};

const App = {
  pomodoroTimeWork: document.getElementById('pomodoro_time_work'),
  pomodoroTimeBreak: document.getElementById('pomodoro_time_break'),

  init(pomodoro) {
    if (pomodoro === 'work') return Pomodoro1.startWork();
    if (pomodoro === 'break') return Pomodoro1.startBreak();
  },

  pause(pomodoro) {
    if (pomodoro === 'work') return clearInterval(Pomodoro1.startWorkMinutes);
    if (pomodoro === 'break') return clearInterval(Pomodoro1.startBreakMinutes);

    clearInterval(Pomodoro1.startWorkMinutes);
    clearInterval(Pomodoro1.startBreakMinutes);
  },

  reset(pomodoro) {
    let { workTime, breakTime } = Utils.getValues();

    if (pomodoro === 'work') Pomodoro1.workTime += workTime;
    if (pomodoro === 'break') Pomodoro1.breakTime += breakTime;

    DOM.initialPomodoro();
  },

  show(pomodoro, minutes, seconds) {
    minutes = Utils.zeroFill(minutes);
    seconds = Utils.zeroFill(seconds);

    if (pomodoro === 'work') this.pomodoroTimeWork.value = `${minutes}:${seconds}`;
    if (pomodoro === 'break') this.pomodoroTimeBreak.value = `${minutes}:${seconds}`;
  },
};

const Pomodoro1 = new Pomodoro();
DOM.createSessions();
DOM.setClassSessions();
DOM.initialPomodoro();
