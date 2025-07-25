# 【React & TypeScript】カスタム設定で作る！安全なパスワードジェネレーター開発チュートリアル (010)

## 🎯 1. はじめに (The "Why")

### このチュートリアルで作るもの

このチュートリアルでは、React と TypeScript を使い、ユーザーが細かく条件を指定できる「パスワードジェネレーター」を開発します。生成したパスワードはワンクリックでクリップボードにコピーできます。

### なぜこの技術が重要なのか？

オンラインセキュリティの基本は、推測されにくい強力なパスワードを使用することです。しかし、人間が自力でランダムなパスワードを作成するのは難しく、同じものを使い回してしまう危険性もあります。

このアプリ開発を通して、単なる UI 構築に留まらない、より実践的なスキルセットを習得します。

- **複雑な状態管理:** 複数のユーザー入力（長さ、文字種など）をリアルタイムでハンドリングし、それらをロジックに反映させる。
- **アルゴリズムの実装:** 条件に基づいてランダムなデータを生成し、それを保証する（例: 「記号を必ず 1 文字含める」）という、一歩進んだプログラミングロジックを体験する。
- **ブラウザ API の活用:** `navigator.clipboard` のような、ブラウザが提供するネイティブ機能と連携する方法を学ぶ。

これらのスキルは、ユーザーの入力を受け取り、何らかの処理を加えて結果を返す、という Web アプリケーションの基本的な流れをより深く理解するために不可欠です。

---

## 🛠️ 2. 環境構築 (公式ドキュメント準拠)

`shadcn/ui` の公式ドキュメントに基づき、Vite、Tailwind CSS、shadcn/ui を使ったモダンな開発環境を構築します。

### Step 1: Vite プロジェクトの作成

```bash
pnpm create vite@latest password-generator --template react-ts
cd password-generator
```

### Step 2: Tailwind CSS と shadcn/ui のセットアップ

これまでのチュートリアルと同様に、Tailwind CSS と shadcn/ui をセットアップします。

```bash
# Tailwind CSS のインストール
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui のセットアップ
pnpm install -D @types/node
pnpm dlx shadcn-ui@latest init
```

`tailwind.config.js`, `tsconfig.json`, `vite.config.ts` の設定は、これまでのチュートリアルと同様です。

### Step 3: 必要なコンポーネントとアイコンの追加

`shadcn/ui` CLI を使って、今回使用するコンポーネントをあらかじめ追加しておきます。アイコンライブラリ `lucide-react` もインストールします。

```bash
pnpm install lucide-react
pnpm dlx shadcn-ui@latest add card slider checkbox button input label
```

これで開発の準備が整いました。

---

## 🧠 3. 思考を促す開発ステップ

### Step 1: 状態管理と UI の骨格作成

まず、パスワードジェネレーターに必要なすべての設定値を `useState` で管理し、それらを操作するための UI コンポーネントを配置します。

`src/App.tsx` を以下のように編集します。

```tsx
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

// パスワード設定のオプションを型として定義
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

  // ...以降のロジックは次のステップで...

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
          </div>

          <div className="space-y-6">
            <div>
              <Label>パスワードの長さ: {length}</Label>
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
```

### Step 2: パスワード生成ロジックの実装

アプリケーションの心臓部である、パスワードを生成するロジックを実装します。ただランダムに選ぶだけでなく、「選択した文字種は必ず 1 文字以上含める」という要件を満たすのがポイントです。

`App.tsx` に `handleGeneratePassword` 関数を追加します。

```tsx
// ... Appコンポーネント内 ...

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
    alert("少なくとも1つの文字種を選択してください。");
    return;
  }

  let guaranteedChars = "";
  let charPool = "";

  // TODO:
  // 1. `selectedOptions` をループ処理する
  // 2. ループの中で、保証する文字 (`guaranteedChars`) を各種別から1文字ずつランダムに選んで追加する
  //    ヒント: `charSets[option][Math.floor(Math.random() * charSets[option].length)]`
  // 3. 同時に、全体の文字プール (`charPool`) に選択された文字セットをすべて結合する

  const remainingLength = length - guaranteedChars.length;
  let randomChars = "";

  // TODO:
  // 4. `remainingLength` の分だけ、`charPool` からランダムに文字を選んで `randomChars` に追加する

  // TODO:
  // 5. 保証された文字とランダムな文字を結合し、配列に変換してシャッフルする
  //    ヒント: `(guaranteedChars + randomChars).split('')`
  // 6. シャッフルした配列を文字列に戻し、`password` stateを更新する
};

// ... ButtonのonClickにこの関数をセットする ...
```

> #### 💡 深掘りコラム: なぜ「保証」と「シャッフル」が必要？
>
> もし全ての文字種をごちゃ混ぜにした巨大な文字プールからランダムに選ぶだけだと、偶然「記号」が含まれない、といった事態が起こり得ます。これではユーザーの指定した条件を満たせません。そこで、**① まず各種別から 1 文字ずつ確保し、② 残りを全体から選び、③ 最後に全体をシャッフルする**ことで、「条件を確実に満たしつつ、かつ文字の出現位置が予測不可能」な、より安全なパスワードを生成できます。

### Step 3: クリップボードへのコピー機能

最後に、生成したパスワードを簡単に利用できるよう、クリップボードにコピーする機能を実装します。

`App.tsx` に `handleCopy` 関数を追加し、UI と連携させます。

```tsx
// ... Appコンポーネント内 ...

const handleCopy = () => {
  if (!password) return; // パスワードがなければ何もしない

  // TODO:
  // 1. `navigator.clipboard.writeText(password)` を使ってクリップボードにコピーする
  // 2. コピーに成功したら、`copied` stateを `true` にする
  // 3. 2秒後に `copied` stateを `false` に戻すタイマーをセットする
  //    ヒント: `setTimeout(() => setCopied(false), 2000)`
};

// ... return文のInputの隣 ...
<Button onClick={handleCopy} variant="ghost" size="icon">
  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
</Button>;
```

---

## 🔥 4. 挑戦課題 (Challenges)

- **Easy:** 生成されたパスワードの強度（長さと含まれる文字種で判定）を「弱い」「普通」「強い」「非常に強い」のように、色付きのテキストで表示してみましょう。
- **Medium:** チェックボックスのいずれかが変更されたら、自動的に新しいパスワードが生成されるようにリファクタリングしてみましょう。（ヒント: `useEffect` を使う）
- **Hard:** パスワード生成ロジックをカスタムフック (`usePasswordGenerator`) として切り出し、コンポーネントのロジックをさらにクリーンにしてみましょう。

---

## ✅ 5. まとめ

お疲れ様でした！このチュートリアルでは、見た目以上に多くの実践的なテクニックを学びました。

- `useState` を使った、複数の関連する状態（オプションオブジェクト）の管理
- スライダーやチェックボックスといった多様なフォーム要素のハンドリング
- 条件を満たすためのランダムデータ生成アルゴリズムの実装
- `navigator.clipboard` API を利用した、ブラウザ機能との連携
- ユーザーへの視覚的なフィードバック（コピー成功表示）の重要性

これらのスキルは、ユーザーの入力を元に動的な処理を行う、あらゆるインタラクティブな Web アプリケーション開発に応用できます。
