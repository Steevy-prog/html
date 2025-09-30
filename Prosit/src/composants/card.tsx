type CardProps = {
  image: string;
  title: string;
  author: string;
  description: string;
};

export default function Card({ image, title, author, description }: CardProps) {
  return (
    <article className="cer-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col md:flex-row">
      <img
        src={image}
        alt={title}
        className="w-full md:w-48 h-48 md:h-auto object-cover"
      />

      <div className="cer-info p-4 flex flex-col flex-1">
        <div>
          <p className="author text-xs text-slate-500 mb-1">par {author}</p>
          <h4 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
            {title}
          </h4>
          <p className="description text-sm text-slate-600 mb-4 line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-auto">
          <button className="consult-btn w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm transition">
            Consulter le CER
          </button>
        </div>
      </div>
    </article>
  );
}