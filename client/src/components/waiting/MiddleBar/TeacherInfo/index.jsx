import teacherImage from '../../../../assets/img/teacher.png'
import Info from '../Info'
import style from './style.module.scss'
import { useContext } from 'react'
import { RoomInfoContext } from '../../../../Context'

const TeacherInfo = () => {
  const { teacher } = useContext(RoomInfoContext)

  return (
    <div className={style.teacherInfo}>
      {teacher && (
        <div className={style.profile}>
          <div className={style.about}>
            <div className={style.pic}>
              <img src={teacherImage} alt=""/>
            </div>
            <div className={style.aboutInfo}>
              <span className={style.name}>
                {teacher.name + ' ' + teacher.surname}
              </span>
              <div className={style.rating}>
                <div className={style.stars}/>
                <div className={style.rate}>
                  {'( ' + teacher.stars + ' )'}
                </div>
              </div>
              <span className={style.profession}>{teacher.profession}</span>
            </div>
          </div>
          <div className={style.info}>
            <Info
              text={'students'}
              count={teacher.students}
              type="medium"
            />
            <Info
              text={'follower'}
              count={teacher.followers}
              type="medium"
            />
            <Info text={'friend'} count={teacher.friends} type="medium"/>
          </div>
        </div>
      )}
      {teacher && (
        <div className={style.description}>
          <p>{teacher.description}</p>
        </div>
      )}
      {teacher && (
        <div className={style.infoBar}>
          <Info
            text={'videoCourses'}
            count={teacher.videoCourses}
            type="large"
          />
          <Info
            text={'onlineLessons'}
            count={teacher.onlineLessons}
            type="large"
          />
          <Info
            text={'conference'}
            count={teacher.conference}
            type="large"
          />
          <Info
            text={'liveStream'}
            count={teacher.liveStream}
            type="large"
          />
        </div>
      )}
    </div>
  )
}

export default TeacherInfo
