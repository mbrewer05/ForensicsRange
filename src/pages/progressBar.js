import React from 'react'

const ProgressBar = ({done}) => {
  const [style, setStyle] = React.useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${done}%`
    }

    setStyle(newStyle);
  },1000);

  return(
    <div class = "progress-bar">
        <div class = "progress-done" style={style}>
            {done}%
        </div>
    </div>
  )
};
  
export default ProgressBar;