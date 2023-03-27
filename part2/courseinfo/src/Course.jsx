export const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);
const Header = ({ course }) => <h2>{course}</h2>;
const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </div>
);
const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);
const Total = ({ parts }) => (
  <p>
    <b>total of {parts.reduce((acc, p) => acc + p.exercises, 0)} exercises</b>
  </p>
);
