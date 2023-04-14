import { useState } from "react";
import { ListBox } from "@/components/elements/ListBox";
import { FeatureInput, GenerateButton } from "@/features/monster";
import { useCharacterController } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

let feature = "";
const languages = ["Japanese", "English", "Korean", "Chinese"];
const maxLength = 30;

export type MonsterGeneratorProps = BaseProps;

/**
 * モンスター出力
 * @keit0728
 * @param className 親要素から指定されるスタイル
 */
export const MonsterGenerator = ({ className }: MonsterGeneratorProps) => {
  const characterController = useCharacterController();
  const [loading, setLoading] = useState(false);
  const [maxLengthOver, setMaxLengthOver] = useState(false);
  const [language, setLanguage] = useState(languages[0]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_countCharacters(e.target.value) <= maxLength) {
      feature = e.target.value;
      if (maxLengthOver) setMaxLengthOver(false);
      return;
    }
    setMaxLengthOver(true);
  };

  const handleClick = async () => {
    if (maxLengthOver) {
      alert(
        "Too many characters. Please limit the number of characters to 30 for single-byte characters and 15 for double-byte characters.",
      );
      return;
    }
    setLoading(true);
    try {
      await characterController.generate(feature, language);
      setLoading(false);
    } catch (error) {
      alert("Invalid monster name.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className={clsx(className, "flex", "flex-col", "items-center")}>
      <FeatureInput
        className={clsx("w-[100%]", "h-[40px]", "mb-[20px]")}
        onChange={handleChange}
      />
      <div
        className={clsx(
          "flex",
          "flex",
          "justify-center",
          "items-center",
          "w-[100%]",
        )}
      >
        <ListBox
          className={clsx("w-[80%]")}
          selected={language}
          setSelected={setLanguage}
          list={languages}
        />
        <GenerateButton
          className={clsx("ml-[10px]", "w-[20%]")}
          onClick={handleClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

const _countCharacters = (str: string): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.charCodeAt(i) <= 255 ? 1 : 2;
  }
  return count;
};
