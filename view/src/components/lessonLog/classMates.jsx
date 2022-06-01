import React, { useState, useEffect, useContext, memo } from 'react'
import { RoomInfoContext } from '../../Context'
import Icon from '../core/Icon'
import gold from '../../assets/img/gold.png'
import silver from '../../assets/img/silver.png'
import bronze from '../../assets/img/bronze.png'
import style from './style.module.scss'

const Scales = memo(({ type }) => {
  switch (type) {
    case 'first':
      return (
        <div className={style.firstPointer}>
          <Icon name="scale_big_top" width={18} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
        </div>
      )
    case 'last':
      return (
        <div className={style.lastPointer}>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_big" width={18} height={2}/>
        </div>
      )
    default:
      return (
        <div className={style.pointers}>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_big" width={18} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
          <Icon name="scale_small" width={6} height={2}/>
        </div>
      )
  }
})

const ClassMates = () => {
  const { isTeacher, me, classmates: users } = useContext(RoomInfoContext)

  const [ topTree, setTopTree ] = useState([
    { prizeIcon: gold, avg: 100 },
    { prizeIcon: silver, avg: 95 },
    { prizeIcon: bronze, avg: 90 },
  ])
  const [ classMates, setClassMates ] = useState([])

  useEffect(() => {
    const allClassMates = isTeacher ? [ ...users ] : [ me, ...users ]
    const classMates =
      (allClassMates &&
        allClassMates
          .sort(({ avg }, { avg: avgComp }) => avgComp - avg)
          .filter(({ avg, ...otherProps }) => {
            if (avg === 100) {
              setTopTree((state) => {
                const clone = [ ...state ]
                clone[0] = { prizeIcon: gold, avg: 100, ...otherProps }
                return clone
              })
              return false
            } else if (avg >= 95) {
              setTopTree((state) => {
                const clone = [ ...state ]
                clone[1] = { prizeIcon: silver, avg: 95, ...otherProps }
                return clone
              })
              return false
            } else if (avg >= 90) {
              setTopTree((state) => {
                const clone = [ ...state ]
                clone[2] = { prizeIcon: bronze, ...otherProps, avg }
                return clone
              })
              return false
            }

            return true
          })) ||
      []
    setClassMates(classMates)
  }, [ users, setTopTree, isTeacher, me ])

  return (
    <div className={style.classMates}>
      <div className={style.infoBar}>
        <span>Progress of members</span>
        <Icon name="question_mark" width={16} height={16}/>
      </div>
      <div className={style.userList}>
        {topTree.map(({ name, surname, img, id, prizeIcon, avg }, index) => (
          <div className={style.itemWrapper} key={index}>
            <div className={style.averageNumber}>
              <span>{avg}</span>
            </div>
            <Scales
              type={
                index === 0
                  ? 'first'
                  : index === classMates.length - 1
                    ? 'last'
                    : ''
              }
            />
            <div
              className={
                me.id === id ? style.myMainContainer : style.mainContainer
              }
            >
              <div className={style.profile}>
                <div className={style.prize}>
                  <img src={prizeIcon} alt=""/>
                </div>
                <div className={style.profilePic}>
                  {img ? (
                    <img src={img} alt={name}/>
                  ) : (
                    <Icon
                      name="default_profile_big_prize"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <span
                  className={name && surname ? style.default : style.placholder}
                >
                  {name && surname ? name + ' ' + surname : 'You can be here !'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {classMates.map(
          (
            {
              name,
              surname,
              img,
              grade,
              absentCount,
              attendingPercent,
              id,
              avg,
            },
            index
          ) => (
            <div className={style.itemWrapper} key={index}>
              <div className={style.averageNumber}>
                <span>{avg}</span>
              </div>
              <Scales type={index === classMates.length - 1 ? 'last' : ''}/>
              <div
                className={
                  me.id === id && !isTeacher
                    ? style.myMainContainer
                    : style.mainContainer
                }
              >
                <div className={style.profile}>
                  <div className={style.profilePic}>
                    {img ? (
                      <img src={img} alt={name}/>
                    ) : (
                      <Icon name="default_profile_big" width={40} height={40}/>
                    )}
                  </div>
                  <span className={style.default}>{name + ' ' + surname}</span>
                </div>
                <ul className={style.info}>
                  <li className={style.grade}>{grade}</li>
                  <li className={style.absent}>{absentCount}</li>
                  <li className={style.attend}>{attendingPercent}</li>
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
export default memo(ClassMates)
