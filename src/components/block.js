function Block(props) {
  let css ="w-full h-9 md:w-10 md:h-10  border border-gray-900 ";
  if (!props.content.isVisible) css+= "bg-[#C0C0C0] hover:bg-[#d9d9d9]";
  else css += "bg-gray-600";
  if (props.content.isBomb) css += " bg-red-100";
  let body = "";
  let numberCss = "text-center m-0.5 text-2xl font-extrabold ";
  if(props.content.isFlagged && props.content.isVisible === false) body = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 fill-red-600 ml-1 mt-1">
  <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
</svg>
;
  else if(props.content.isVisible  && props.content.value !== 0){
    body = props.content.value;
    switch(body){
      case 1: numberCss += "text-cyan-500"; break;
      case 2: numberCss += "text-green-500"; break;
      case 3: numberCss += "text-red-500"; break;
      case 4: numberCss += "text-purple-500"; break;
      default: break;
    }
  } 

  return (
    <span
      onClick={() => {
        props.checkBoard();
      }

      }
      className={css}
    >
      <p className={numberCss}> {props.content.isVisible || props.content.isFlagged ? body : ""}
      </p>
    </span>
  );
}

export default Block;
