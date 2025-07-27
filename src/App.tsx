import "./App.css";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

type PasswordOptions = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

function App() {
  // TODO:
  // 1. `length` (number): パスワードの長さを管理するstate (初期値: 12)
  // 2. `options` (PasswordOptions): 4つの文字種を含めるかどうかの真偽値を管理するstate
  //    (初期値: uppercase: true, lowercase: true, numbers: true, symbols: false)
  // 3. `password` (string): 生成されたパスワードを保持するstate (初期値: '')
  // 4. `copied` (boolean): コピー成功のフィードバックUIを管理するstate (初期値: false)

  const [length, setLength] = useState(12);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = () => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    // 選択されたオプションのキーを配列として取得 (例: ['uppercase', 'lowercase', 'numbers'])

    const selectedOptions = Object.keys(options).filter(
      (key) => options[key as keyof PasswordOptions]
    );

    if (selectedOptions.length === 0) {
      alert("少なくとも１つの文字種を選択してください");
      return;
    }

    let guaranteedChars = "";
    let charPool = "";

    // TODO:
    // 1. `selectedOptions` をループ処理する
    // 2. ループの中で、保証する文字 (`guaranteedChars`) を各種別から1文字ずつランダムに選んで追加する
    //    ヒント: `charSets[option][Math.floor(Math.random() * charSets[option].length)]`
    // 3. 同時に、全体の文字プール (`charPool`) に選択された文字セットをすべて結合する

    selectedOptions.forEach((option) => {
      const charSet = charSets[option as keyof typeof charSets];
      const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
      guaranteedChars += randomChar;
      charPool += charSet;
    });

    const remainingLength = length - guaranteedChars.length;
    let randomChars = "";

    // TODO:
    // 4. `remainingLength` の分だけ、`charPool` からランダムに文字を選んで `randomChars` に追加する

    // TODO:
    // 5. 保証された文字とランダムな文字を結合し、配列に変換してシャッフルする
    //    ヒント: `(guaranteedChars + randomChars).split('')`
    // 6. シャッフルした配列を文字列に戻し、`password` stateを更新する

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * charPool.length);
      randomChars += charPool[randomIndex];
    }

    const passwordArray = (guaranteedChars + randomChars).split("");
    for (let i = 0; i < passwordArray.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordArray[i], passwordArray[j]] = [
        passwordArray[j],
        passwordArray[i],
      ];
    }
    const shuffledPassword = passwordArray.join("");
    setPassword(shuffledPassword);
  };

  const handleCopy = () => {
    if (!password) return;

    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>パスワードジェネレーター</CardTitle>
          <CardDescription>安全なパスワードを生成します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              readOnly
              value={password}
              placeholder="ここにパスワードが表示されます"
            />
            <Button onClick={handleCopy} variant="ghost">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              コピー
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <Label>パスワードの長さ： {length}</Label>
              <Slider
                // TODO: valueとonValueChangeを設定して、`length` stateと連携させる
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={8}
                max={32}
                step={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* TODO: 4つのチェックボックスを配置し、`options` stateと連携させる */}
              {/* 例: <div className="flex items-center gap-2">
                    <Checkbox id="uppercase" checked={options.uppercase} onCheckedChange={(checked) => ...} />
                    <Label htmlFor="uppercase">大文字を含める</Label>
                  </div> */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      uppercase: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="uppercase">大文字を含める</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      lowercase: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="lowercase">小文字を含める</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      numbers: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="numbers">数字を含める</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({
                      ...prev,
                      symbols: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="symbols">記号を含める</Label>
              </div>
            </div>
            <Button className="w-full" onClick={handleGeneratePassword}>
              パスワードを生成
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
