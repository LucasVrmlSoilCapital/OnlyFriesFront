export const Confirmation = () => {
  return (
    <div className="pt-20 bg-[#FFEDCD] h-[100vh]">
      <img
        src="./hug-fries.png"
        className="w-72 mx-auto mb-8"
        alt="fries hugging itself"
      />
      <h1 className="text-xl text-amber-950 pb-4">Commande ajoutée !</h1>
      <p className="text-amber-950">Merci d'avoir commandé sur OnlyFries 😏</p>
      <p className="text-amber-950">
        La commande sera envoyée une fois que l'admin auras finalisé la commande
        groupée.
      </p>
    </div>
  );
};
