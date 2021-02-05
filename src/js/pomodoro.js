const Utils = {
  url: new URL(document.location).searchParams,

  zeroFill(n) {
    return ('0' + n).slice(-2);
  },

  getValues() {
    const workTime = Number(Utils.url.get('working_time'));
    const breakTime = Number(Utils.url.get('breaking_time'));
    const numberSessions = Number(Utils.url.get('number_sessions'));

    return {
      workTime: workTime,
      breakTime: breakTime,
      numberSessions: numberSessions,
    };
  },
};

const DOM = {
  sessionWork: document.getElementById('sessions-work'),
  sessionBreak: document.getElementById('sessions-break'),
  sessionsSpanWork: document.querySelector('#sessions-work'),
  sessionsSpanBreak: document.querySelector('#sessions-break'),
  pomodoroWork: document.getElementById('time_work'),
  pomodoroBreak: document.getElementById('time_break'),
  btnWork: document.getElementById('btn-work'),
  btnBreak: document.getElementById('btn-break'),

  createSessions() {
    let { numberSessions } = Utils.getValues();

    for (let i = 0; i < numberSessions; i++) {
      let spanWork = document.createElement('span');
      let spanBreak = document.createElement('span');
      spanWork.innerHTML = `.`;
      spanBreak.innerHTML = `.`;
      DOM.sessionWork.appendChild(spanWork);
      DOM.sessionBreak.appendChild(spanBreak);
    }
  },

  setClassSessions() {
    const spansWork = document.querySelectorAll('#sessions-work span');
    const spansBreak = document.querySelectorAll('#sessions-break span');

    for (let tagSpan of spansWork) {
      tagSpan.classList.add('work');
    }

    for (let tagSpan of spansBreak) {
      tagSpan.classList.add('break');
    }
  },

  doneSessions(session) {
    const spansWork = document.querySelectorAll('#sessions-work span');
    const spansBreak = document.querySelectorAll('#sessions-break span');

    if (session === 'work') {
      for (let session of spansWork) {
        if (!session.classList.contains('done')) {
          session.classList.add('done');
          break;
        }
      }
    } else if (session === 'break') {
      for (let session of spansBreak) {
        if (!session.classList.contains('done')) {
          session.classList.add('done');
          break;
        }
      }
    }
  },

  pomodoroHide(pomodoro) {
    if (pomodoro === 'work') {
      DOM.pomodoroWork.classList.add('hide');
      DOM.pomodoroBreak.classList.remove('hide');
    } else if (pomodoro === 'break') {
      DOM.pomodoroBreak.classList.add('hide');
      DOM.pomodoroWork.classList.remove('hide');
    }
  },

  playPauseIcon(e) {
    const spansBreak = document.querySelectorAll('#sessions-break span');
    const index = spansBreak.length - 1;

    if (spansBreak[index].classList.contains('done')) {
      DOM.modalSessionsDone();
    } else {
      if (e.classList.contains('play')) {
        e.classList.remove('play');
        e.classList.add('pause');
        e.innerHTML = `<i class="fas fa-pause"></i>`;

        if (e.classList.contains('btn-work')) {
          App.init('work');
          DOM.btnWork.title = 'Pause';
        } else if (e.classList.contains('btn-break')) {
          App.init('break');
          DOM.btnBreak.title = 'Pause';
        }
      } else if (e.classList.contains('pause')) {
        e.classList.remove('pause');
        e.classList.add('play');
        e.innerHTML = `<i class="fas fa-play"></i>`;

        if (e.classList.contains('btn-work')) {
          App.pause('work');
          DOM.btnWork.title = 'Play';
        } else if (e.classList.contains('btn-break')) {
          App.pause('break');
          DOM.btnBreak.title = 'Play';
        }
      }
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

  default() {
    App.pomodoroTimeWork.value = `${Utils.zeroFill(workTime)}:00`;
    App.pomodoroTimeBreak.value = `${Utils.zeroFill(breakTime)}:00`;

    DOM.btnWork.innerHTML = `<i class="fas fa-play"></i>`;
    DOM.btnWork.title = 'Play';
    DOM.btnBreak.innerHTML = `<i class="fas fa-play"></i>`;
    DOM.btnBreak.title = 'Play';
  },
};

const Pomodoro = {
  minutes: ({ workTime, breakTime } = Utils.getValues()),
  secondsWork: Utils.zeroFill(0),
  secondsBreak: Utils.zeroFill(0),
  startWork: 0,
  startBreak: 0,

  startPomodoroWork() {
    Pomodoro.startWork = setInterval(function () {
      if (Number(Pomodoro.secondsWork) === 0) {
        Pomodoro.secondsWork = 60;
        Pomodoro.minutes.workTime -= 1;
      }

      Pomodoro.secondsWork -= 1;
      Pomodoro.minutes.workTime = Utils.zeroFill(Pomodoro.minutes.workTime);
      Pomodoro.secondsWork = Utils.zeroFill(Pomodoro.secondsWork);
      App.pomodoroTimeWork.value = `${Pomodoro.minutes.workTime}:${Pomodoro.secondsWork}`;

      if (Number(Pomodoro.secondsWork) === 0 && Number(Pomodoro.minutes.workTime) === 0) {
        App.pause();
        DOM.sounds();
        DOM.playPauseIcon(DOM.btnWork);
        DOM.doneSessions('work');
        DOM.pomodoroHide('work');
        App.reset('work');
      }
    }, 1000);
  },

  startPomodoroBreak() {
    Pomodoro.startBreak = setInterval(function () {
      if (Number(Pomodoro.secondsBreak) === 0) {
        Pomodoro.secondsBreak = 60;
        Pomodoro.minutes.breakTime -= 1;
      }

      Pomodoro.secondsBreak -= 1;
      Pomodoro.minutes.breakTime = Utils.zeroFill(Pomodoro.minutes.breakTime);
      Pomodoro.secondsBreak = Utils.zeroFill(Pomodoro.secondsBreak);
      App.pomodoroTimeBreak.value = `${Pomodoro.minutes.breakTime}:${Pomodoro.secondsBreak}`;

      if (Number(Pomodoro.secondsBreak) === 0 && Number(Pomodoro.minutes.breakTime) === 0) {
        App.pause();
        DOM.sounds();
        DOM.playPauseIcon(DOM.btnBreak);
        DOM.doneSessions('break');
        DOM.pomodoroHide('break');
        App.reset('break');
      }
    }, 1000);
  },
};

const App = {
  pomodoroTimeWork: document.getElementById('pomodoro_time_work'),
  pomodoroTimeBreak: document.getElementById('pomodoro_time_break'),

  init(pomodoro) {
    App.pause();

    if (pomodoro === 'work') {
      Pomodoro.startPomodoroWork();
    } else if (pomodoro === 'break') {
      Pomodoro.startPomodoroBreak();
    }
  },

  pause(pomodoro) {
    if (pomodoro === 'work') {
      clearInterval(Pomodoro.startWork);
    } else if (pomodoro === 'break') {
      clearInterval(Pomodoro.startBreak);
    } else {
      clearInterval(Pomodoro.startWork);
      clearInterval(Pomodoro.startBreak);
    }
  },

  reset(pomodoro) {
    if (pomodoro === 'work') {
      Pomodoro.minutes.workTime += Utils.getValues().workTime;
      App.pomodoroTimeWork.value = `${Utils.zeroFill(Pomodoro.minutes.workTime)}:00`;
    } else if (pomodoro === 'break') {
      Pomodoro.minutes.breakTime += Utils.getValues().breakTime;
      App.pomodoroTimeBreak.value = `${Utils.zeroFill(Pomodoro.minutes.breakTime)}:00`;
    }
  },
};

DOM.createSessions();
DOM.setClassSessions();
DOM.default();
