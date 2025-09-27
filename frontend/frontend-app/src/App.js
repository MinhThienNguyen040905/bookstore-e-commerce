import { useState } from "react";

const courses = [
  {
    id: 1,
    name: 'HTML, CSS'
  },
  {
    id: 2,
    name: 'JavaScript'
  },
  {
    id: 3,
    name: 'ReactJS'
  }

]
function App() {

  const [checked, setChecked] = useState([])
  const handlerChecked = (id) => {
    setChecked((pre) => {
      if (pre.includes(id)) return pre.filter(item => item !== id)
      return [...pre, id]
    })
  }

  return (
    <div className="App" style={{ padding: 30 }}>
      {
        courses.map(course => (
          <div key={course.id}>
            <input type="checkbox"
              checked={checked.includes(course.id)}
              onChange={() => handlerChecked(course.id)} />
            {course.name}

          </div>
        ))
      }
      <button onClick={() => console.log(checked)}>Register</button>
    </div>
  );
}

export default App;
