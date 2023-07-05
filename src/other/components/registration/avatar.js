import React, { useRef, useEffect, useState } from "react";
import config from "../../../config";
import { _t } from "../../../helpers";

const getImg = (img) =>
  config.common.s3CloudFrontAssets +
  config.common.assets.img.path +
  config.avatars.avatarPath +
  "/" +
  img;

function RegistrationAvatar({ value, setFieldValue }) {
  const [open, setOpen] = useState(false),
    close = useRef(() => setOpen(false)),
    container = useRef(null);

  useEffect(() => {
    let body = document.body;
    if (open) {
      body.addEventListener("click", close.current);
    } else {
      body.removeEventListener("click", close.current);
    }
  }, [open]);

  function toggleOpen(e) {
    if (!open) {
      if (e.target === container?.current) {
        setOpen((state) => !state);
      }
    }
  }

  let containerName = "input_item_label account__change_avatar";

  if (open) {
    containerName += " active";
  }
  return (
    <div className={containerName} onClick={toggleOpen} ref={container}>
      {_t("Avatar")}
      <div className="account__current_img_box">
        <img src={getImg(value)} alt="" />
      </div>
      <ul className="account__img_list">
        {config.avatars.all.map((avatar, index) => {
          const img = getImg(avatar),
            onClick = () => setFieldValue(avatar);

          return (
            <li className="account__img_item" onClick={onClick} key={avatar}>
              <img src={img} alt="" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default React.memo(RegistrationAvatar);
