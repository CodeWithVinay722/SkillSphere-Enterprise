export default function StarRating({ value = 0, onChange, readOnly = false, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating ${readOnly ? "readonly" : ""}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= value ? "filled" : ""}`}
          style={{ fontSize: size }}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
