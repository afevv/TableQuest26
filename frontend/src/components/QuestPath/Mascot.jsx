function Mascot({ image, emoji, top }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[62%] hidden w-24 transition-[top] duration-700 ease-in-out sm:block"
      style={{ top }}
    >
      <img src={image} alt="" className="w-full" />
      <span className="absolute -right-2 -top-3 grid size-9 place-items-center rounded-full bg-white text-xl shadow">
        {emoji}
      </span>
    </div>
  );
}

export default Mascot;
