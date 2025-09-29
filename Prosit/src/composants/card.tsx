type cardprops ={
    image:string;
    title:string;
    author:string;
    description:string;
}

function Card({image,title,author,description}:cardprops){
    return(
    <>
                    <div className="cer-card">
                    <img src={image} alt={title}/>
                    <div className="cer-info">
                        <p className="author">par {author}</p>
                        <h4>{title}</h4>
                        <p className="description">{description}</p>
                        <button className="consult-btn">Consulter le CER</button>
                    </div>
                </div>
    </>
    )
}

export default Card