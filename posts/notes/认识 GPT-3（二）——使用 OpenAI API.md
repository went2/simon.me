---
title: "认识 GPT-3 （二）——使用 OpenAI API"
date: "2023-03-12"
year: "2023"
abstract: ""
---

## 前言

这是介绍 GPT-3 基本概念系列的第二篇，本篇说明 OpenAI API，在此之前需要有 OpenAI 账号。

大纲：
1. Playground 界面说明
2. OpenAI API 参数说明
3. 如何自定 GPT-3 
4. Token 的计算

>  把 GPT-3 想象成一个朋友或同事，你想让他做些事，你会怎么描述想要他做的任务？问问看，看 GPT-3 怎么回复，如果答得不怎么让你满意，调整你的指令接着问。
>  —— Peter Welinder, vice president of product at OpenAI

## 1. Playground

OpenAI 的 Playground 是在线调试模型 API 的界面。登陆 OpenAI 官网后，顶部导航栏会出现 Playground 菜单，点击菜单打开页面主要内容如下图（截至2023年3月10日）：

![openAI-playground](https://user-images.githubusercontent.com/20923112/225516295-cb56c3d4-e306-4467-bab0-5d75f4124ba4.png)

1. 提示输入区：输入想让 API 做的事情
2. 预设参数选择：预设（preset）指一组预先设定好的参数值用于完成某个任务，选择一个预设会自动调整右边的参数，同时生成一段提示的示例。
3. 参数调整区域：调整具体的参数。

两个名词做说明：

1. prompt: 提示，用户在输入框中输入的文字就叫提示（包括在 chatGPT 聊天框中输入的文字），提示的形式如提要求、问问题、做分类等。提示为 GPT-3 模型生成结果提供上下文。
2. completion: 意为生成，补全，GPT-3 基于输入的提示，在它的语料库中匹配最可能出现一系列的文本补充到提示后面。

Playground 的用法是，先选择一个预设（如 Completion 文本生成），然后在输入框输入提示，点击 Submit。API 会处理输入并在提示语的下方显示结果，同时右下角会显示这次对话消耗的 token。Token 是使用 API 的计费单位，1 个英文单词约为 1.3 token，1 个中文字为 2 token

GPT-3 会将每次输入的提示以及返回的 completion，作为下一次 completion 的上下文。

### 提示工程：设计提示语

GPT-3 生成的结果质量与提示的质量直接相关，提示语的用词结构和词语顺序会影响输出结果，理解提示设计是发掘 GPT-3 潜力的关键。

理解 GPT-3 怎么认识世界是编写良好提示的秘诀。GPT-3 只是处理文本，不应该假设它了解物理世界，即便它表现出很了解的样子。它可以描述蒙娜丽莎的历史、意义、重要性，不是因为它见过这幅画，而是因为它接受了描述蒙娜丽莎的文本训练。

使用模型，就是要用它已经具备的信息生成有用的结果。好比玩一个哑剧游戏，表演者只提供足够的信息但不明确说出词语，玩家通过表演者的提示猜测正确的词语是什么。同样，使用 GPT-3 时，我们给它**提供足够的上下文（即输入的训练提示）**，让模型**找出模式，执行给定的任务**。

设计提示语时，首要目标应是零次学习（`zero-shot learning` ）得到回应，即试着不给它任何外部的示例，让它生成期望的结果，如果模型没有达到目标，就给它展示一些示例，进行少次学习（`few-shot learning` ），最后才进行基于整个语料库的微调（fine-tuning）。

相比生成真实信息，GPT-3 更擅长讲故事，它接收输入的文本，并用它认为最佳的方式来**完成输入的信息**，我们看起来是在和 GPT-3（包括 chatGPT） 一问一答，实际上 GPT-3 是**基于输入的文本，继续扩展最有可能出现的文本，直到它认为语句完整**。如果从你喜欢的小说中找出几段输入，它会用相同的风格继续下去。GPT-3 工作时会浏览上下文，如果没有合适的上下文，它可能会生成不一致的结果，如（直接问它美国人的平均寿命是什么）：

```
Q: What is human life expectancy in the United States?
A: 
```

如果像这样不带上下文的给 GPT-3 提示，实际上是在要它从天量的训练数据中寻找一般性的答案，得到的结果可能是泛泛且不合期望的，因为模型不知道用训练数据的哪个部分来回答问题。

相反，给它提供合适的上下文会显著提升产生的结果的速率和质量，上下文限定了模型回答问题需要检查的天量训练数据的范围，据此生成的文本也更具体：

```
I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".

Q: What is human life expectancy in the United States?
A:
```

总而言之，只要给定合适的上下文，GPT-3 就能胜任进行创造性写作、事实性回答的工作，以下是构建有效提示的步骤：
	1.  确定希望通过模型解决什么类型的问题，如分类、问答、文本生成或创意写作。
	2.  先考虑是否有零次学习的方式进行提示，如果需要一些外部示例来给模型作参考，想几个具体的示例。
	3.  考虑如何以文本方式表述问题，在 GPT-3 的“text-in, text-out” 界面使用，尽可能多想几种如何用文本形式表达问题的情况。例如，假设想要构建一个广告文案助手，该助手可以通过查看产品名称和描述来生成创意文案。用 “text-in, text-out” 的格式来界定就是，“输入：产品名称和描述，输出：广告文案”，如下所示：
		 - Input: Betty's Bikes, for price-sensitive shoppers
		 - Output: Low prices and huge selection. Free and fast delivery. Order online today!
	4. 如果决定使用外部示例，请尽可能少用，并尝试融入多样性，以让模型尽可能多的生成不同内容，避免模型过度拟合或预测偏差。

以上可作为创建一个训练提示的参考过程。

## 2. OpenAI API

### 参数说明

说明 Playground 界面右边可供调整的一系列参数：

![parameters](https://user-images.githubusercontent.com/20923112/225516759-1332f7b0-5b66-468e-8093-126dd53396c1.png)
图：OpenAI API 的参数调节区 

参数简要介绍见下表：
|  API 参数   | 功能  |
|  :---  | :---  |
|  Mode  | 选择任务执行模式，改变任务模式会改变左边的交互界面  |
|  Model  | 选择语言模型，不同模型适用的任务、处理能力、处理速度不同，GPT-3 自带四个模型，Davinci, Ada, Babbage, Curie。其中 Davinci 性能最强，是 Playground 默认选项  |
|  Temperature  | 控制回答的创造性（随机性），0-1之间，0 的结果最不随机，最准确。数量越大表示模型在预测结果前会先计算多个符合上下文的可能结果，得到的结果更多样，但随之可能包含语法错误、生成的结果无意义等  |
|  Maximum length  | 设置生成结果的最大 token 数量，模型会按次数量填充生成的结果，此项设置与 API 使用费直接相关。比如，做文本分类的工作就将此项设置得小，如 100 以下，免得模型用多余不相关的文本填充设定的文本长度。设置有上限，一次提示最多 2048 token（约 1000 个中文字，1500 个英文单词），一次请求+回答上限是 4000 token（如果请求用了 2000 个token，生成的结果将在 2000 token以内）。如果进行大量文本的输入和输出，就要考虑拆分提示，分多次进行  |
|  Stop sequences  | 设置一组停止口令，模型在生成包含口令的序列时会停止，并将已生成的结果返回  |
|  Top P  | 与 Temperature 类似，控制模型在生成结果过程中需要考虑多少随机结果，设为 0.1 表示模型生成结果时只考虑 10% 的可能性，设为 1 表示模型会为最终结果的生成考虑所有可能性，得到的结果也最富有创造性  |
|  Frequency penalty 和 Presence penalty  | Frequency penalty 和 Presence penalty 控制提示对结果的影响程度，Frequency penalties 会提升输入结果对输入文本的“复读”，Presence penalty 会提升模型讨论新主题的可能性 |
|  Best of  | 在服务端进行 n 次生成，然后返回最佳的一次结果。取值 1-20，streaming 只在设为1时可用。设值约大，消耗的 token 越多 |
|  Inject start and restart text  | Inject start text，将文本插入到 completion 的开头；Inject restart text，将文本插入到 completion 的结尾  |
|  Show probabilities  | 会高亮显示每个生成 token 的概率，用于对提示与生成的过程进行 debug  |

#### 对输出结果影响大参数：

一是 Template 和 Top P，二是 Frequency penalties 和 Presence penalties

**1. Template 和 Top P**

这两个参数控制输出结果的散发性（创造性），两个设置有联系，改变其中的值会影响另一个。建议做法是，将其中一项保持 1，然后调整另一项影响结果。如将 Top P 设 1 ，让模型以最有创造力的方式产生回答，然后通过调整 Temperature 控制结果的随机性。

大语言模型基于概率逻辑而不是会话逻辑生成结果，对于相同输入，会产生什么结果取决于设置了什么参数，对于模型来说，它总是从根据参数设置，从天量训练数据集（公版书籍、web文档、维基百科文章）中匹配概率最大的结果，而不是每次都寻找一个最有解。Temperature 和 Top P 参数其生成结果的广泛程度。

假设你打算办个创业公司，要取个名字，把 Temperature 调到 0.7 以上进行多次提示，可以得到结果不同的回答；

对于一些需要准确性而不是创造性的任务，如问题回答、分类、提取摘要，就把 Temperature 调低。

Temperature = 0.2 & Top P = 1 情况下的分类任务示例：

```
// 提示语：
The following is a list of companies and the categories they fall into:

Facebook: Social Media, Technology
LinkedIn: Social Media, Technology, Enterprise, Careers
Uber: Transportation, Technology, Marketplace
Unilever: Conglomerate, Consumer Goods
Mcdonalds: Food, Fast Food, Logistics, Restaurants
FedEx:

// 输出：
Logistics, Shipping
```

也可以在 Temperature =1，设置 Top P 的值进行提示。

**2. Frequency penalties, Presence penalties**

Frequency penalty 和 Presence penalty 控制提示（上一次的 completion + 新的输入）对结果的影响程度，Frequency penalties 会提升输入结果对输入文本的“复读”，Presence penalty 会提升模型讨论新主题的可能性。

#### 影响计费的参数

1. Maximum length：返回结果的最大 token 数量，非创作性的任务可限定该值以免不必要的消耗；
2. Best Of：先在服务端生成 n 项结果，返回最佳结果，设置的越大，消耗token越多，一般设置最小；
3. Stop Sequence：设置停止口令，模型在生成包含口令的序列时会停止，并将已生成的结果返回

#### 其他有用的参数

**Inject start and restart text**：Inject start text 和 Inject restart text 可将文字分别插入 completion 的开头和结束，用于设置输入与响应的模式，这对于 model 和 user 都很好理解。

### 可选语言模型

GPT-3 有四个执行引擎：Davinci, Curie, Babbage, Ada
- Davinci 性能最强，最能理解上下文，能执行的任务最广泛，但速度最慢；
- Curie 在功能上次于 Davinci，但响应速度更快；
- Babbage 再次之；
- Ada 速度最快，费用最低，但仅能处理一些不需要理解上下文的任务，如语法纠正、简单的分类等

基于四个基本模型，OpenAI 推出了一系列 InstructGPT 模型，这些模型更擅长理解指令并按照指令操作，同时比 GPT-3 原始版本更加真实。它们使用 OpenAI 关于 alignment research 的技术。这些模型是由人类进行重复训练，现在被部署为 OpenAI API 的默认语言模型，如GPT-3 系列的`text-curie-001`，`text-babbage-001` 等，GPT-3.5 系列的 `gpt-3.5-turbo`， `text-davinci-003`，`text-davinci-003`，`text-curie-001` 。

GPT-3.5 的模型们是对 GPT-3 系模型的升级，目前（截至2023年3月10日） Playground 可选的都是 GPT-3.5 系列模型，但如果要对模型进行 `fine-tuned` 训练，只能基于 GPT-3 的四个基本模型 (`davinci`, `curie`, `ada`, 和 `babbage`) 进行。

模型的更多介绍与如何选择参考[官方对 Models 的介绍](https://platform.openai.com/docs/models)

## 3. 自定义 GPT-3

前文多次提到可以对 GPT-3 进行微调（fine-tune），微调是说用户可以提供自己的数对 GPT-3 进行训练，创建一个定制版的模型。可以用任何类型、数量的自定义数据集，整体微调模型，使模型每次执行时都明确按照预期意愿进行。

微调后的模型的能力和知识将会集中在用于微调数据集的内容和语义上。这会限制模型的创造力和主题选择的范围，这种方式适用于分类内部文档等涉及内部术语的工作。

一旦模型完成了微调，就不再需要在提示中提供示例，与提示设计相比，定制 GPT-3 会产生更好的结果，因为在此过程中，可以提供更多的示例。这节省了成本，缩短了响应时间，并提高了输出的质量和可靠性。

OpenAI 研究发表的[研究论文](https://cdn.openai.com/palms.pdf) 提到，提供不到100个示例，就能看到微调 GPT-3 的成果——它在执行某些任务上的性能得到了明显提高，随着添加更多数据，其性能将持续提升，提升的规律大致是样本数量每增加一倍，质量呈线性增长。

### 3.1 几个使用定制 GPT-3 构建的 APP

- Keeper Tax, 帮助独立工作者管理税务的 APP，使用模型提取文本、分类交易，帮客户提出处理税务过程中容易 miss 的地方。使用定制 GPT-3 后识别率从 85%提升到93%；
- Viable，一家帮助企业从客户反馈中获得洞见的公司。通过定制 GPT-3，Viable 将海量的非结构化数据转化为可读的自然语言报告，并提高了报告的可靠性。对于客户反馈的总结的准确性从66%提高到了90%。
- Sana Labs：一家全球领先的使用 AI 进行教育领域的开发和应用公司，利用最新的机器学习成果为企业提供个性化的学习体验。通过使用自己的数据定制 GPT-3，Sana 的问题和内容生成从语法正确但是内容通用，变成高度准确的响应，给他们带来 60% 的改进，让其用户获得更加个性化的体验。
- Elicit：一个能够帮助回答研究问题的人工智能研究助手，利用学术论文的研究结果寻找最相关的摘要，然后应用 GPT-3 生成与问题相关的论文主张。 定制版的 GPT-3 表现优于 prompt 设计，在三个方面实现了改进：结果更易理解 24%，准确性提高了 17%，整体表现提高了 33%。

### 3.2 自定义 GPT-3 的过程

自定义 GPT-3 大致包括三个步骤： 
1. 准备新的训练数据并将其上传到 OpenAI 服务器
2. 用新的训练数据微调现有模型
3. 使用微调模型

#### 1. 准备和上传训练数据

训练数据就是模型进行微调的输入数据。训练数据必须是 `JSONL` 格式文档，每一行是一个示例，包含两样内容：1. 提示 2. 提示对应的生成文本。示例数量可以任意，强烈建议创建一个 `values-targeted` 的数据集，为模型提供高质量的数据和广泛的表达。提供的示例越多，微调结果就越好。 `JSONL` 文档格式如下所示：

```jsonl
{"prompt": "prompt text", "completion": "ideal generated text"}
{"prompt": "prompt text", "completion": "ideal generated text"}
{"prompt": "prompt text", "completion": "ideal generated text"}
...
```

prompt 字段的文本包含要完成的确切提示文本，而 completion 字段的内容是希望 GPT-3 生成的理想文本内容。可以使用 OpenAI 的 CLI 数据准备工具将本地文件转为 `JSONL` 格式，使用以下命令：

`openai tools fine_tunes.prepare_data -f LOCAL_FILE`

#### 2. 训练一个新的微调模型

按照上面所述准备好训练数据，就可以通过OpenAI CLI 进行微调作业。使用以下命令：

`openai api fine_tunes.create -t TRAIN_FILE_ID_OR_PATH -m BASE_MODEL`

`BASE_MODEL` 是使用的基础模型的名称（Ada、Babbage、Curie或Davinci）。运行此命令会执行以下几项操作：
1. 使用文件上传的 endpoint 上传文件
2. 使用命令行的请求配置微调模型 
3. 流式传输事件日志，直到微调作业完成

日志流式传输有助于实时了解发生的情况，并对任何事故/故障做出响应。流式传输可能需要几分钟到几小时，具体取决于队列中的作业数量和数据集的大小。

#### 使用微调模型

一旦成功微调模型，就可以在命令行中使用，通过将模型名称作为请求的中的一个参数，使用以下命令：

`openai api completions.create -m FINE_TUNED_MODEL -p YOUR_PROMPT`

`FINE_TUNED_MODEL`是你的模型，`YOUR_PROMPT` 是您要在此请求中完成的提示。

可以在这些请求中用上 Temperature， frequency penalty, presence penalty 等参数。

更多内容参考官方 [fine-tuned 文档](https://platform.openai.com/docs/guides/fine-tuning)

## 4. Token 计算

最后提一下 token。

给模型输入的提示以及模型的生成文本计算数量用的是 token：

- 英文字：1 token 约为 4 个英文字母，1 个英文单词平均占 1.3 个 token。莎士比亚全集约 90 万英文字，算成 token 约 120 万。
- 中文字：1 个中文字消耗 2 token，1 个中文标点符号消耗 1 到 3 个 token。

Playground 中右下角会提示 token 的消耗：

![tokens](https://user-images.githubusercontent.com/20923112/225516949-6baa7d65-6f09-4c3c-96ce-a38044c3627f.png)

上图表示，输入一段英文作为提示，消耗 9 token，模型返回结果时最多消耗 100 token，这次 prompt + completion 最多会消耗 109 个token。

也可以通过 [Tokenizer](https://platform.openai.com/tokenizer) 工具在线测试输入的文本消耗多少 token

### token 计价

参考官方价格说明 [pricing](https://openai.com/pricing)

## 5. 参考

1. [书籍：GPT-3 Building Innovative NLP Products Using Large Language Models](https://book.douban.com/subject/35852216/)