import Icon from '../../../core/Icon'
import style from './style.module.scss'

const InsideBar = ({ title, type, info, arr, level }) => {
  const isTipeLevel = type === 'level'
  return (
    <div className={style.insideBar}>
      <div className={style.title}>
        <h6>{title}</h6>
        <div className={style.level}>
          {isTipeLevel && <div className={`circle ${level || 'unset'}`}/>}
          <span>{info}</span>
        </div>
      </div>
      <div className={style.container}>
        {arr.map(({ text, level, date }, key) => {
          return (
            <div className={style.content} key={key}>
              <div className={style.head}>
                {isTipeLevel && (
                  <div className={`circle ${level || 'unset'}`}/>
                )}
                <div className={isTipeLevel ? style.text : style.textSmall}>
                  {text}
                </div>
              </div>
              <div className={style.contentFooter}>
                <div className={style.date}>{date}</div>
                <div className={style.classMates}>
                  <Icon name="waiting_show_users" width={16} height={16}/>
                  <span>7</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default InsideBar
