module.exports = (openTime, closeTime) => {
  const defaultOpen = 9;
  const defaultClose = 21;
  const open = Number(openTime.split(':')[0]);
  const close = Number(closeTime.split(':')[0]);
  const unavailableSlot = [];
  if (open !== defaultOpen) {
    const emptyDuration1 = new Array((open - defaultOpen) * 2).fill(0);
    let hr = 0;
    const closeDuration1 = emptyDuration1.map((item, index) => {
      if (open < 10) {
      } else if (index % 2 === 0) {
        let slot = `${defaultOpen + hr}:00-${defaultOpen + hr}:30`;
        if (slot.length === 9) {
          return `0${defaultOpen + hr}:00-0${defaultOpen + hr}:30`;
        }
        if (slot.length === 10) {
          return `0${defaultOpen + hr}:00-0${defaultOpen + hr}:30`;
        }
        return slot;
      } else {
        let slot = `${defaultOpen + hr}:30-${defaultOpen + hr + 1}:00`;
        if (slot.length === 10) {
          slot = `0${defaultOpen + hr}:30-${defaultOpen + hr + 1}:00`;
          hr++;
          return slot;
        }
        hr++;
        return slot;
      }
    });
    unavailableSlot.push(closeDuration1);
  }

  if (close !== defaultClose) {
    const emptyDuration2 = new Array((defaultClose - close) * 2).fill(0);
    hr = 0;
    const closeDuration2 = emptyDuration2.map((item, index) => {
      if (index % 2 === 0) {
        let slot = `${defaultClose + hr - 1}:00-${defaultClose + hr - 1}:30`;
        return slot;
      } else {
        let slot = `${defaultClose + hr - 1}:30-${defaultClose + hr}:00`;
        hr--;
        return slot;
      }
    });
    unavailableSlot.push(closeDuration2);
  }

  return unavailableSlot.flat();
};
