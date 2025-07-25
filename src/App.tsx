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
import { Copy, Check, Car } from "lucide-react";

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
            {/* TODO: コピーボタンをここに配置。クリックでクリップボードにコピーする */}
            <Button>コピー</Button>
          </div>

          <div className="space-y-6">
            <div>
              <Label>パスワードの長さ： {length}</Label>
              <Slider
                // TODO: valueとonValueChangeを設定して、`length` stateと連携させる
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
            </div>
            <Button className="w-full">パスワードを生成</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
