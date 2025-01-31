import data from "imgs/svg-data.json";

export default function Icon({ name, className, id, path_className, path_id}) {
    let basedata = data[name]
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        id = {id}
        viewBox={basedata.viewBox}
      >
        <path className={path_className} id={path_id} d={basedata.d}/>
      </svg>
    );
  }