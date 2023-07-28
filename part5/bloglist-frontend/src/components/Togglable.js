export const Togglable = ({ visible, setVisible, buttonLabel, children }) => {
  const toggleVisibility = () => setVisible((visible) => !visible);

  return (
    <div>
      {visible ? (
        <div>
          {children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      ) : (
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      )}
    </div>
  );
};
