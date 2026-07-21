// 冀教版三年级英语短句数据库
// 每个单元 4-6 个与主题相关的实用短句

export interface Sentence {
  id: string;
  english: string;
  chinese: string;
  unit: number;
  semester: '上' | '下';
}

export const sentences: Sentence[] = [
  // ========== 上册 Unit 1: 问候与介绍 ==========
  { id: 's1-1', english: 'Hello, I am Li Ming.', chinese: '你好，我是李明。', unit: 1, semester: '上' },
  { id: 's1-2', english: 'What is your name?', chinese: '你叫什么名字？', unit: 1, semester: '上' },
  { id: 's1-3', english: 'My name is Jenny.', chinese: '我的名字是珍妮。', unit: 1, semester: '上' },
  { id: 's1-4', english: 'How are you?', chinese: '你好吗？', unit: 1, semester: '上' },
  { id: 's1-5', english: 'I am fine, thanks.', chinese: '我很好，谢谢。', unit: 1, semester: '上' },
  { id: 's1-6', english: 'Nice to meet you.', chinese: '很高兴见到你。', unit: 1, semester: '上' },

  // ========== 上册 Unit 2: 我的学校 ==========
  { id: 's2-1', english: 'This is my school.', chinese: '这是我的学校。', unit: 2, semester: '上' },
  { id: 's2-2', english: 'Where is the library?', chinese: '图书馆在哪里？', unit: 2, semester: '上' },
  { id: 's2-3', english: 'It is a big playground.', chinese: '这是一个大操场。', unit: 2, semester: '上' },
  { id: 's2-4', english: 'Let us go to the classroom.', chinese: '我们去教室吧。', unit: 2, semester: '上' },
  { id: 's2-5', english: 'Please keep it tidy.', chinese: '请保持整洁。', unit: 2, semester: '上' },

  // ========== 上册 Unit 3: 颜色 ==========
  { id: 's3-1', english: 'What colour is it?', chinese: '它是什么颜色的？', unit: 3, semester: '上' },
  { id: 's3-2', english: 'It is red and blue.', chinese: '它是红色和蓝色的。', unit: 3, semester: '上' },
  { id: 's3-3', english: 'I like the colour green.', chinese: '我喜欢绿色。', unit: 3, semester: '上' },
  { id: 's3-4', english: 'The apple is red.', chinese: '这个苹果是红色的。', unit: 3, semester: '上' },
  { id: 's3-5', english: 'The sky is blue.', chinese: '天空是蓝色的。', unit: 3, semester: '上' },

  // ========== 上册 Unit 4: 我的朋友 ==========
  { id: 's4-1', english: 'This is my friend.', chinese: '这是我的朋友。', unit: 4, semester: '上' },
  { id: 's4-2', english: 'She is my friend.', chinese: '她是我的朋友。', unit: 4, semester: '上' },
  { id: 's4-3', english: 'I have one pencil and two books.', chinese: '我有一支铅笔和两本书。', unit: 4, semester: '上' },
  { id: 's4-4', english: 'Where is my ruler?', chinese: '我的尺子在哪里？', unit: 4, semester: '上' },
  { id: 's4-5', english: 'The pen is on the desk.', chinese: '钢笔在桌子上。', unit: 4, semester: '上' },
  { id: 's4-6', english: 'The book is under the chair.', chinese: '书在椅子下面。', unit: 4, semester: '上' },

  // ========== 上册 Unit 5: 我的身体 ==========
  { id: 's5-1', english: 'This is my body.', chinese: '这是我的身体。', unit: 5, semester: '上' },
  { id: 's5-2', english: 'I have two eyes and one nose.', chinese: '我有两只眼睛和一个鼻子。', unit: 5, semester: '上' },
  { id: 's5-3', english: 'Touch your head.', chinese: '摸摸你的头。', unit: 5, semester: '上' },
  { id: 's5-4', english: 'Clap your hands.', chinese: '拍拍你的手。', unit: 5, semester: '上' },
  { id: 's5-5', english: 'It has a long tail.', chinese: '它有一条长尾巴。', unit: 5, semester: '上' },
  { id: 's5-6', english: 'The elephant is big.', chinese: '大象很大。', unit: 5, semester: '上' },

  // ========== 上册 Unit 6: 我的家庭 ==========
  { id: 's6-1', english: 'This is my family.', chinese: '这是我的家庭。', unit: 6, semester: '上' },
  { id: 's6-2', english: 'My father is a teacher.', chinese: '我的爸爸是一位老师。', unit: 6, semester: '上' },
  { id: 's6-3', english: 'My mother is a doctor.', chinese: '我的妈妈是一位医生。', unit: 6, semester: '上' },
  { id: 's6-4', english: 'I love my family.', chinese: '我爱我的家人。', unit: 6, semester: '上' },
  { id: 's6-5', english: 'We are happy.', chinese: '我们很快乐。', unit: 6, semester: '上' },
  { id: 's6-6', english: 'He is a tall policeman.', chinese: '他是一位高高的警察。', unit: 6, semester: '上' },

  // ========== 下册 Unit 1 (Unit 7): 食物 ==========
  { id: 's7-1', english: 'I like apples.', chinese: '我喜欢苹果。', unit: 7, semester: '下' },
  { id: 's7-2', english: 'Do you like bananas?', chinese: '你喜欢香蕉吗？', unit: 7, semester: '下' },
  { id: 's7-3', english: 'My favourite food is chicken.', chinese: '我最喜欢的食物是鸡肉。', unit: 7, semester: '下' },
  { id: 's7-4', english: 'I eat rice every day.', chinese: '我每天都吃米饭。', unit: 7, semester: '下' },
  { id: 's7-5', english: 'Bread and milk, please.', chinese: '请给我面包和牛奶。', unit: 7, semester: '下' },

  // ========== 下册 Unit 2 (Unit 8): 我的一天 ==========
  { id: 's8-1', english: 'I have breakfast at seven.', chinese: '我七点吃早餐。', unit: 8, semester: '下' },
  { id: 's8-2', english: 'I am hungry.', chinese: '我饿了。', unit: 8, semester: '下' },
  { id: 's8-3', english: 'Let us have lunch.', chinese: '我们吃午餐吧。', unit: 8, semester: '下' },
  { id: 's8-4', english: 'I like noodles and soup.', chinese: '我喜欢面条和汤。', unit: 8, semester: '下' },
  { id: 's8-5', english: 'Good evening, Mum!', chinese: '晚上好，妈妈！', unit: 8, semester: '下' },

  // ========== 下册 Unit 3 (Unit 9): 我的房间 ==========
  { id: 's9-1', english: 'I get up in the morning.', chinese: '我早上起床。', unit: 9, semester: '下' },
  { id: 's9-2', english: 'I make my bed.', chinese: '我整理床铺。', unit: 9, semester: '下' },
  { id: 's9-3', english: 'Wash your hands, please.', chinese: '请洗手。', unit: 9, semester: '下' },
  { id: 's9-4', english: 'My room is clean.', chinese: '我的房间很干净。', unit: 9, semester: '下' },
  { id: 's9-5', english: 'Put your schoolbag on the chair.', chinese: '把书包放在椅子上。', unit: 9, semester: '下' },

  // ========== 下册 Unit 4 (Unit 10): 在农场 ==========
  { id: 's10-1', english: 'Let us go to the farm.', chinese: '我们去农场吧。', unit: 10, semester: '下' },
  { id: 's10-2', english: 'I can see a horse.', chinese: '我能看见一匹马。', unit: 10, semester: '下' },
  { id: 's10-3', english: 'The cow is big.', chinese: '奶牛很大。', unit: 10, semester: '下' },
  { id: 's10-4', english: 'There is a pig and a rabbit.', chinese: '有一只猪和一只兔子。', unit: 10, semester: '下' },
  { id: 's10-5', english: 'The sheep is white.', chinese: '绵羊是白色的。', unit: 10, semester: '下' },

  // ========== 下册 Unit 5 (Unit 11): 动物 ==========
  { id: 's11-1', english: 'I like animals.', chinese: '我喜欢动物。', unit: 11, semester: '下' },
  { id: 's11-2', english: 'The cat is small.', chinese: '猫很小。', unit: 11, semester: '下' },
  { id: 's11-3', english: 'The tiger is strong.', chinese: '老虎很强壮。', unit: 11, semester: '下' },
  { id: 's11-4', english: 'Let us go to the zoo.', chinese: '我们去动物园吧。', unit: 11, semester: '下' },
  { id: 's11-5', english: 'The monkey can jump.', chinese: '猴子会跳。', unit: 11, semester: '下' },
  { id: 's11-6', english: 'The bird can fly.', chinese: '鸟会飞。', unit: 11, semester: '下' },

  // ========== 下册 Unit 6 (Unit 12): 一起玩 ==========
  { id: 's12-1', english: 'Let us play together.', chinese: '我们一起玩吧。', unit: 12, semester: '下' },
  { id: 's12-2', english: 'I can run fast.', chinese: '我能跑得很快。', unit: 12, semester: '下' },
  { id: 's12-3', english: 'Can you swim?', chinese: '你会游泳吗？', unit: 12, semester: '下' },
  { id: 's12-4', english: 'I like to sing and dance.', chinese: '我喜欢唱歌和跳舞。', unit: 12, semester: '下' },
  { id: 's12-5', english: 'I can draw a picture.', chinese: '我会画一幅画。', unit: 12, semester: '下' },
  { id: 's12-6', english: 'This is a fun game.', chinese: '这是一个有趣的游戏。', unit: 12, semester: '下' },
];

// 按单元获取短句
export function getSentencesByUnit(unitId: number): Sentence[] {
  return sentences.filter(s => s.unit === unitId);
}
