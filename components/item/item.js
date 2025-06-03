import Image from 'next/image';

export default function Item() {
  return (
    <div className="item">
      <div className="item-image">
        <Image
          src="https://planb.weblexia.in/wp-content/uploads/2024/01/B-Signature-1.png"
          alt="B Signature"
          width={100}
          height={100}
        />
      </div>
      <div className="item-details">
        <h3>B Signature</h3>
        <p>
          This is the item description. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Donec varius ante id diam posuere, eget scelerisque
          mauris imperdiet. Suspendisse potenti.{" "}
        </p>
        <div className="item-price"></div>
      </div>
    </div>
  );
}
