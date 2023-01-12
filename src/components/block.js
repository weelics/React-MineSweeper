function Block(props) {
  let css ="w-full h-9 md:w-10 md:h-10  border border-gray-900 ";
  if (!props.content.isVisible) css+= "bg-[#C0C0C0] hover:bg-[#d9d9d9]";
  else css += "bg-gray-600";
  //if (props.content.isBomb) css += " bg-red-500";
  let body = "";
  let numberCss = "text-center m-0.5 text-2xl font-extrabold ";
  if(props.content.isVisible  && props.content.value !== 0){
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
      <p className={numberCss}> {props.content.isVisible ? body : ""}
      </p>
    </span>
  );
}

export default Block;
