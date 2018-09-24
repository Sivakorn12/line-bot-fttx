const firebase = require('../utils/firebase')
const dateTime = require('../utils/dateTime')
const memoFormatter = require('../formatter/memoFormatter')
const database = firebase.database()
const memoServices = {
  state: {
    text: '',
    date: ''
  },
  async write (userId) {
    const memoRef = await database.ref('memos/')
    await memoRef.push({
      text: this.state.text,
      date: this.state.date,
      userId: userId,
      timestamp: dateTime.nowDate().format()
    })
  },
  async getAllAvailable() {
    const todayUnix = dateTime.nowDate().startOf('day').valueOf()
    const memos = await database.ref('memos/').orderByChild('date').startAt(todayUnix).once('value')
    if (memos.val()){
      return memoFormatter.formatMemo(memos)
    }
    return 'ไม่มีนัดว้อย มึงว่าง!!!'
  },
  async checkForTodayMeeting () {
    const todayUnix = dateTime.nowDate().startOf('day').valueOf()
    const memos = await database.ref('memos/').orderByChild('date').equalTo(todayUnix).once('value')
    if (memos.val()) {
      return memoFormatter.formatCronMemo(memos)
    }
    return 'ไม่มีนัดว้อย มึงว่าง!!!'
  },
  setText (text) {
    this.state.text = text
  },
  setDate (date) {
    console.log(dateTime.nowDate(date).format('YYYY-MM-DD'))
    this.state.date = dateTime.nowDate(date).valueOf()
  }
}
module.exports = memoServices