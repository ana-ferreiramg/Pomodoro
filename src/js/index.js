const btnContinue = document.querySelector('#div_btn_continue button');

btnContinue.addEventListener('click', () => {
  let workTime = document.getElementById('working_time').value;
  let breakTime = document.getElementById('breaking_time').value;
  let sessions = document.getElementById('number_sessions').value;

  window.location.href = `?working_time=${workTime}&breaking_time=${breakTime}&number_sessions${sessions}`;
});

const setTime = {
  add(el) {
    return (el += 1);
  },

  sub(el) {
    return (el -= 1);
  },
};

const PomodoroTime = {
  btnsAdd: document.querySelectorAll('.btn-add'),
  btnsSub: document.querySelectorAll('.btn-sub'),
  inputWorkTime: document.getElementById('working_time'),
  inputBreakTime: document.getElementById('breaking_time'),
  inputNumberSessions: document.getElementById('number_sessions'),

  add() {
    PomodoroTime.btnsAdd[0].addEventListener('click', () => {
      let workTime = Number(PomodoroTime.inputWorkTime.value);

      return (PomodoroTime.inputWorkTime.value = setTime.add(workTime));
    });

    PomodoroTime.btnsAdd[1].addEventListener('click', () => {
      let breakTime = Number(PomodoroTime.inputBreakTime.value);

      return (PomodoroTime.inputBreakTime.value = setTime.add(breakTime));
    });

    PomodoroTime.btnsAdd[2].addEventListener('click', () => {
      let sessions = Number(PomodoroTime.inputNumberSessions.value);

      return (PomodoroTime.inputNumberSessions.value = setTime.add(sessions));
    });
  },

  sub() {
    PomodoroTime.btnsSub[0].addEventListener('click', () => {
      let workTime = Number(PomodoroTime.inputWorkTime.value);

      if (workTime > 25) {
        return (PomodoroTime.inputWorkTime.value = setTime.sub(workTime));
      }
    });

    PomodoroTime.btnsSub[1].addEventListener('click', () => {
      let breakTime = Number(PomodoroTime.inputBreakTime.value);

      if (breakTime > 5) {
        return (PomodoroTime.inputBreakTime.value = setTime.sub(breakTime));
      }
    });

    PomodoroTime.btnsSub[2].addEventListener('click', () => {
      let sessions = Number(PomodoroTime.inputNumberSessions.value);

      if (sessions > 1) {
        return (PomodoroTime.inputNumberSessions.value = setTime.sub(sessions));
      }
    });
  },
};
PomodoroTime.add();
PomodoroTime.sub();
