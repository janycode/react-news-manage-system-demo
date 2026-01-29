import style from './Child.module.scss'

export default function Child() {
  return (
      <div>
          Child
          <ul>
              <li className={style.item}>aaa</li>
              <li className={style.item}>bbb</li>
          </ul>
      </div>
  )
}
