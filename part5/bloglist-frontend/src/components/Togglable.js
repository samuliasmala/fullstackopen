import PropTypes from 'prop-types';

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

Togglable.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
