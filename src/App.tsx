import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './App.scss'

type NumObj = {
  times: number // 该数字可以使用的次数
  num: number // 该数字表示的值
}

const Backspace = 'Backspace'
const Clear = 'Clear'
const Lang = 'lang'

function App() {
  const { t, i18n } = useTranslation()

  const [chosenNums, setChosenNums] = useState<Array<number | string>>([])
  const [expressionArr, setExpressionArr] = useState<Array<string | number>>([])
  const [flag, setFlag] = useState<string | number>('')
  
  // 生成1-10的数字组成的二维数组
  const [nums, setNums] = useState(() => {
    const nums: Array<Array<NumObj>> = [[], []]
    for(let i = 1; i <= 10; i++) {
      if (i <= 5) {
        nums[0].push({ times: 0, num: i })
      } else {
        nums[1].push({ times: 0, num: i })
      }
    }
    return nums
  })

  // 生成随机的四个数字
  const genRandomNums = useCallback(() => {
    const randoms = []
    for(let i = 0; i < 4; i++) {
      // 1-10的随机整数
      const random = Math.floor((Math.random() * 10) + 1)
      randoms.push(random)
    }

    setChosenNums(randoms)

    setCurrentNums(randoms)
  }, [])

  // 根据当前的chosenNums计算nums的值
  const setCurrentNums = (randoms: Array<string | number>) => {
    // chosenNums发生变化后
    const _nums = nums.map(numsArr => numsArr.map(numObj => ({ ...numObj, times: 0 })))

    randoms.forEach(chosenNum => {
      const chosenVal = +chosenNum
      const index = chosenVal <= 5 ? 0 : 1
      const target = _nums[index].find(item => item.num === chosenVal)
      if (!target) return
      target.times++
    })
    setNums(_nums)
  }

  // 新游戏
  const startNewGame = () => {
    genRandomNums()
    setExpressionArr([])
    setFlag('')
  }

  useEffect(() => {
    startNewGame()
    // 查看本地存储的lang
    const lang = localStorage.getItem(Lang)
    lang && i18n.changeLanguage(lang)
  }, [])

  const operators = [
    [
      [ '+', '+' ],
      [ '-', '-' ],
      [ '×', '*' ],
      [ '/', '/' ],
    ],
    [
      [ '(', '(' ],
      [ ')', ')' ],
      [ '←', Backspace ],
      [ 'C', Clear ],
    ]
  ]

  // 点击数字
  const clickNum = (numObj: NumObj) => {
    const { times, num } = numObj
    if (times <= 0) return

    // 判断前一个表达式是不是数字
    const prev = expressionArr[expressionArr.length - 1] || ''
    const append: string[] = []
    if (Number.isInteger(prev)) {
      // 自动插入加号
      append.push('+')
    }
    numObj.times--
    setExpressionArr(arr => arr.concat(append, num))
  }

  // 点击运算符
  const clickOperator = (operatorArr: string[]) => {
    const [_, operatorVal] = operatorArr
    if (operatorVal === Clear) {
      // 清空操作
      setExpressionArr([])
      setCurrentNums(chosenNums)
      setFlag('')
    } else if (operatorVal === Backspace) {
      // 回退操作
      const lastOne = expressionArr[expressionArr.length - 1]
      if (Number.isInteger(lastOne)) {
        const val = +lastOne
        const index = val <= 5 ? 0 : 1
        const target = nums[index].find(item => item.num === val)
        if (!target) return
        target!.times++
      }
      setExpressionArr(arr =>  arr.slice(0, arr.length - 1))
    } else {
      setExpressionArr([...expressionArr, operatorVal])
    }
  }

  // 点击计算按钮
  const calculate = () => {
    // 将所有数字都用完才能进行计算
    let legal = true
    nums.forEach(numArr => {
      numArr.forEach(numObj => {
        if (numObj.times > 0) {
          legal = false
        }
      })
    })
    if (!legal) return

    const expressionStr = expressionArr.join('')
    try {
      const result = new Function('return ' + expressionStr)()
      if (result === 24) {
        setFlag(1)
      } else {
        setFlag(0)
      }
    } catch (err) {
      setFlag(-1)
    }
  }

  // 切换语言
  const toggleLang = () => {
    const lang = i18n.language
    const newLang = lang === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
    // 保存到本地
    localStorage.setItem(Lang, newLang)
  }
  return (
    <>
      <div className="game-title">
        <div className="name">{t('name')}<sup>{t('edition')}</sup></div>
        <div className="toggle" title={t('langTip')}>
          <button onClick={toggleLang}>{t(Lang)}</button>
        </div>
      </div>
      <div className="chosen-box">
        {
          chosenNums.map((chosenNum, i) => (
            <div className="chosen" key={i + '-' + chosenNum}>{chosenNum}</div>
          ))
        }
      </div>
      <div className="expression-box">
        {
          expressionArr.map((expression, i) => (
            <span key={i}>{expression}</span>
          ))
        }
      </div>
      <div className="nums-box">
        {
          nums.map((item, i) => (
            <div className="line" key={i}>
              {
                item.map((num, j) => (
                  <button className='num' key={i + '-' + j} disabled={num.times <= 0} onClick={() => clickNum(num)}>{num.num}</button>
                ))
              }
            </div>
          ))
        }        
      </div>
      <div className="operators-box">
        {
          operators.map((item, i) => (
            <div className='line' key={i}>
              {
                item.map(operator => (
                  <button key={operator[0]} className='operator' onClick={() => clickOperator(operator)}>{operator[0]}</button>
                ))
              }
            </div>
          ))
        }
      </div>
      {
        flag === -1 ? (
          <div className="result-box error">{t('result.error')}</div>
        ) : flag === 1 ? (
          <div className="result-box correct">{t('result.correct')}</div>
        ) : flag === 0 ? (
          <div className="result-box wrong">{t('result.wrong')}</div>
        ) : null
      }
      <div className="calculate-btn">
        <button onClick={calculate}>{t('calculate')}</button>
      </div>
      <div className="new-game-btn">
        <button onClick={startNewGame}>{t('restart')}</button>
      </div>
    </>
  )
}

export default App
