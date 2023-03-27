import { useState } from 'react';

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button setValue={setGood}>good</Button>
      <Button setValue={setNeutral}>neutral</Button>
      <Button setValue={setBad}>bad</Button>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;

const Button = ({ setValue, children }) => (
  <button onClick={() => setValue((prev) => prev + 1)}>{children}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const avg = (good - bad) / total;
  const pos = good / total;

  if (total === 0)
    return (
      <>
        <h1>statistics</h1>
        No feedback given
      </>
    );

  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={avg} />
          <StatisticLine text="positive" value={pos * 100} />
        </tbody>
      </table>
    </>
  );
};
