import React, { memo, useContext } from 'react'
import { RoomInfoContext } from '../../../Context'
import Student from './Student'
import style from './style.module.scss'

const RightSideBar = () => {
  const { me, classmates, isTeacher } = useContext(RoomInfoContext)
  return (
    <div className={style.rightSideBar}>
      {classmates &&
        me &&
        [me, ...classmates].map((elm, index) => {
          return (
            <div key={index}>
              {index === 0 ? (
                <>
                  <h5 className={style.title}> My Information</h5>
                  <Student info={elm} {...{ isTeacher }} />
                  <h5
                    className={style.classmates}
                    style={
                      isTeacher
                        ? {}
                        : { marginBottom: '16px', marginTop: '16px' }
                    }
                  >
                    {isTeacher ? 'Students' : 'Classmates'}
                  </h5>
                </>
              ) : (
                <Student
                  info={elm}
                  withBorder={index < classmates.length}
                  key={index}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}
export default memo(RightSideBar)
