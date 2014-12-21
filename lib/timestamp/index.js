function mtime2Timestamp (mtime) {
  var monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };

  // from : Thu Oct 30 2014 14:03:04 $MT+0900 (JST)
  // to   : 2014/1/30 14:03:04

  var t = mtime.split(' ');
  var year = t[3];
  var month = monthMap[t[1]];
  var day = t[2];
  var time = t[4];

  return [
    [year, month, day].join('/'),
    time
  ].join(' ');
}

function timestamp2Num (timestamp) {
  return timestamp.replace(/[\/ :]/g, '') - 0;
}

module.exports = {
  mtime2__: mtime2Timestamp,
  __2Num: timestamp2Num
};
