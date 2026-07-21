// 冀教版（三年级起点）2024/2025新版 小学英语三年级单词库
// 上册 6 单元 + 下册 6 单元

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  unit: number;
  unitName: string;
  semester: '上' | '下';
}

export interface Unit {
  id: number;
  name: string;
  nameCn: string;
  semester: '上' | '下';
  illustration: string;
}

export const units: Unit[] = [
  // 上册
  { id: 1, name: 'Unit 1: Greetings and Introductions', nameCn: '第一单元：问候与介绍', semester: '上', illustration: 'greetings' },
  { id: 2, name: 'Unit 2: My School', nameCn: '第二单元：我的学校', semester: '上', illustration: 'school' },
  { id: 3, name: 'Unit 3: Colours', nameCn: '第三单元：颜色', semester: '上', illustration: 'colours' },
  { id: 4, name: 'Unit 4: My Friends', nameCn: '第四单元：我的朋友', semester: '上', illustration: 'friends' },
  { id: 5, name: 'Unit 5: My Body', nameCn: '第五单元：我的身体', semester: '上', illustration: 'body' },
  { id: 6, name: 'Unit 6: My Family', nameCn: '第六单元：我的家庭', semester: '上', illustration: 'family' },
  // 下册
  { id: 7, name: 'Unit 1: Food We Like', nameCn: '第一单元：我们喜欢的食物', semester: '下', illustration: 'food' },
  { id: 8, name: 'Unit 2: My Day', nameCn: '第二单元：我的一天', semester: '下', illustration: 'day' },
  { id: 9, name: 'Unit 3: My Room', nameCn: '第三单元：我的房间', semester: '下', illustration: 'room' },
  { id: 10, name: 'Unit 4: On the Farm', nameCn: '第四单元：在农场', semester: '下', illustration: 'farm' },
  { id: 11, name: 'Unit 5: Animals', nameCn: '第五单元：动物', semester: '下', illustration: 'animals' },
  { id: 12, name: 'Unit 6: Let\'s Play!', nameCn: '第六单元：一起玩吧！', semester: '下', illustration: 'play' },
];

export const words: Word[] = [
  // ========== 上册 Unit 1: Greetings and Introductions ==========
  { id: 'u1-1', word: 'hi', phonetic: '/haɪ/', meaning: '嗨；你好', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-2', word: 'hello', phonetic: '/həˈləʊ/', meaning: '喂；你好', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-3', word: 'I', phonetic: '/aɪ/', meaning: '我', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-4', word: 'am', phonetic: '/æm/', meaning: '是（用于I后）', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-5', word: 'name', phonetic: '/neɪm/', meaning: '名字', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-6', word: 'fine', phonetic: '/faɪn/', meaning: '健康的', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-7', word: 'thanks', phonetic: '/θæŋks/', meaning: '感谢', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-8', word: 'goodbye', phonetic: '/ɡʊdˈbaɪ/', meaning: '再见', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-9', word: 'bye', phonetic: '/baɪ/', meaning: '再见', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-10', word: 'morning', phonetic: '/ˈmɔːnɪŋ/', meaning: '早上', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-11', word: 'boy', phonetic: '/bɔɪ/', meaning: '男孩', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-12', word: 'girl', phonetic: '/ɡɜːl/', meaning: '女孩', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-13', word: 'nice', phonetic: '/naɪs/', meaning: '令人愉快的；吸引人的', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-14', word: 'meet', phonetic: '/miːt/', meaning: '遇见', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },
  { id: 'u1-15', word: 'teacher', phonetic: '/ˈtiːtʃə/', meaning: '教师', unit: 1, unitName: 'Greetings and Introductions', semester: '上' },

  // ========== 上册 Unit 2: My School ==========
  { id: 'u2-1', word: 'school', phonetic: '/skuːl/', meaning: '学校', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-2', word: 'playground', phonetic: '/ˈpleɪɡraʊnd/', meaning: '操场', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-3', word: 'library', phonetic: '/ˈlaɪbrəri/', meaning: '图书馆', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-4', word: 'classroom', phonetic: '/ˈklɑːsruːm/', meaning: '教室', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-5', word: 'tidy', phonetic: '/ˈtaɪdi/', meaning: '整洁的', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-6', word: 'letter', phonetic: '/ˈletə/', meaning: '字母', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-7', word: 'yes', phonetic: '/jes/', meaning: '是的', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-8', word: 'is', phonetic: '/ɪz/', meaning: '是（用于he, she, it后）', unit: 2, unitName: 'My School', semester: '上' },
  { id: 'u2-9', word: 'are', phonetic: '/ɑː/', meaning: '是（用于we, you, they后）', unit: 2, unitName: 'My School', semester: '上' },

  // ========== 上册 Unit 3: Colours ==========
  { id: 'u3-1', word: 'colour', phonetic: '/ˈkʌlə/', meaning: '颜色', unit: 3, unitName: 'Colours', semester: '上' },
  { id: 'u3-2', word: 'red', phonetic: '/red/', meaning: '红色；红色的', unit: 3, unitName: 'Colours', semester: '上' },
  { id: 'u3-3', word: 'yellow', phonetic: '/ˈjeləʊ/', meaning: '黄色；黄色的', unit: 3, unitName: 'Colours', semester: '上' },
  { id: 'u3-4', word: 'blue', phonetic: '/bluː/', meaning: '蓝色；蓝色的', unit: 3, unitName: 'Colours', semester: '上' },
  { id: 'u3-5', word: 'orange', phonetic: '/ˈɒrɪndʒ/', meaning: '橙色；橙色的', unit: 3, unitName: 'Colours', semester: '上' },
  { id: 'u3-6', word: 'green', phonetic: '/ɡriːn/', meaning: '绿色；绿色的', unit: 3, unitName: 'Colours', semester: '上' },

  // ========== 上册 Unit 4: My Friends ==========
  { id: 'u4-1', word: 'friend', phonetic: '/frend/', meaning: '朋友', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-2', word: 'her', phonetic: '/hɜː/', meaning: '她的', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-3', word: 'his', phonetic: '/hɪz/', meaning: '他的', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-4', word: 'one', phonetic: '/wʌn/', meaning: '一', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-5', word: 'two', phonetic: '/tuː/', meaning: '二', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-6', word: 'three', phonetic: '/θriː/', meaning: '三', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-7', word: 'four', phonetic: '/fɔː/', meaning: '四', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-8', word: 'five', phonetic: '/faɪv/', meaning: '五', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-9', word: 'pen', phonetic: '/pen/', meaning: '钢笔', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-10', word: 'pencil', phonetic: '/ˈpensl/', meaning: '铅笔', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-11', word: 'ruler', phonetic: '/ˈruːlə/', meaning: '尺子', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-12', word: 'book', phonetic: '/bʊk/', meaning: '书', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-13', word: 'pencil box', phonetic: '/ˈpensl bɒks/', meaning: '铅笔盒', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-14', word: 'black', phonetic: '/blæk/', meaning: '黑色；黑色的', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-15', word: 'in', phonetic: '/ɪn/', meaning: '在……里面', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-16', word: 'under', phonetic: '/ˈʌndə/', meaning: '在……下面', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-17', word: 'on', phonetic: '/ɒn/', meaning: '在……上面', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-18', word: 'she', phonetic: '/ʃiː/', meaning: '她', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-19', word: 'he', phonetic: '/hiː/', meaning: '他', unit: 4, unitName: 'My Friends', semester: '上' },
  { id: 'u4-20', word: 'we', phonetic: '/wiː/', meaning: '我们', unit: 4, unitName: 'My Friends', semester: '上' },

  // ========== 上册 Unit 5: My Body ==========
  { id: 'u5-1', word: 'six', phonetic: '/sɪks/', meaning: '六', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-2', word: 'seven', phonetic: '/ˈsevn/', meaning: '七', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-3', word: 'eight', phonetic: '/eɪt/', meaning: '八', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-4', word: 'nine', phonetic: '/naɪn/', meaning: '九', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-5', word: 'ten', phonetic: '/ten/', meaning: '十', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-6', word: 'head', phonetic: '/hed/', meaning: '头部', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-7', word: 'body', phonetic: '/ˈbɒdi/', meaning: '身体', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-8', word: 'leg', phonetic: '/leɡ/', meaning: '腿', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-9', word: 'foot', phonetic: '/fʊt/', meaning: '脚', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-10', word: 'arm', phonetic: '/ɑːm/', meaning: '胳膊', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-11', word: 'hand', phonetic: '/hænd/', meaning: '手', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-12', word: 'face', phonetic: '/feɪs/', meaning: '脸', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-13', word: 'eye', phonetic: '/aɪ/', meaning: '眼睛', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-14', word: 'nose', phonetic: '/nəʊz/', meaning: '鼻子', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-15', word: 'have', phonetic: '/hæv/', meaning: '有', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-16', word: 'ear', phonetic: '/ɪə/', meaning: '耳朵', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-17', word: 'mouth', phonetic: '/maʊθ/', meaning: '嘴巴', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-18', word: 'hair', phonetic: '/heə/', meaning: '头发', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-19', word: 'OK', phonetic: '/əʊˈkeɪ/', meaning: '好；行', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-20', word: 'tail', phonetic: '/teɪl/', meaning: '尾巴', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-21', word: 'short', phonetic: '/ʃɔːt/', meaning: '短的；个子矮的', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-22', word: 'long', phonetic: '/lɒŋ/', meaning: '长的', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-23', word: 'big', phonetic: '/bɪɡ/', meaning: '大的', unit: 5, unitName: 'My Body', semester: '上' },
  { id: 'u5-24', word: 'small', phonetic: '/smɔːl/', meaning: '小的', unit: 5, unitName: 'My Body', semester: '上' },

  // ========== 上册 Unit 6: My Family ==========
  { id: 'u6-1', word: 'family', phonetic: '/ˈfæməli/', meaning: '家庭', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-2', word: 'father', phonetic: '/ˈfɑːðə/', meaning: '父亲', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-3', word: 'mother', phonetic: '/ˈmʌðə/', meaning: '母亲', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-4', word: 'sister', phonetic: '/ˈsɪstə/', meaning: '姐妹', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-5', word: 'brother', phonetic: '/ˈbrʌðə/', meaning: '兄弟', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-6', word: 'doctor', phonetic: '/ˈdɒktə/', meaning: '医生', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-7', word: 'happy', phonetic: '/ˈhæpi/', meaning: '快乐的；幸福的', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-8', word: 'student', phonetic: '/ˈstjuːdnt/', meaning: '学生', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-9', word: 'policeman', phonetic: '/pəˈliːsmən/', meaning: '警察', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-10', word: 'bus driver', phonetic: '/bʌs ˈdraɪvə/', meaning: '公交车司机', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-11', word: 'worker', phonetic: '/ˈwɜːkə/', meaning: '工人', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-12', word: 'love', phonetic: '/lʌv/', meaning: '爱', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-13', word: 'cook', phonetic: '/kʊk/', meaning: '做饭；厨师', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-14', word: 'work', phonetic: '/wɜːk/', meaning: '工作', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-15', word: 'play', phonetic: '/pleɪ/', meaning: '玩', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-16', word: 'look', phonetic: '/lʊk/', meaning: '看', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-17', word: 'tall', phonetic: '/tɔːl/', meaning: '高的', unit: 6, unitName: 'My Family', semester: '上' },
  { id: 'u6-18', word: 'farmer', phonetic: '/ˈfɑːmə/', meaning: '农民', unit: 6, unitName: 'My Family', semester: '上' },

  // ========== 下册 Unit 1 (Unit 7): Food We Like ==========
  { id: 'd1-1', word: 'like', phonetic: '/laɪk/', meaning: '喜欢', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-2', word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-3', word: 'orange', phonetic: '/ˈɒrɪndʒ/', meaning: '橙子', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-4', word: 'you', phonetic: '/juː/', meaning: '你；你们', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-5', word: 'vegetable', phonetic: '/ˈvedʒtəbl/', meaning: '蔬菜', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-6', word: 'meat', phonetic: '/miːt/', meaning: '肉', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-7', word: 'food', phonetic: '/fuːd/', meaning: '食物', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-8', word: 'fruit', phonetic: '/fruːt/', meaning: '水果', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-9', word: 'banana', phonetic: '/bəˈnɑːnə/', meaning: '香蕉', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-10', word: 'grape', phonetic: '/ɡreɪp/', meaning: '葡萄', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-11', word: 'eleven', phonetic: '/ɪˈlevn/', meaning: '十一', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-12', word: 'twelve', phonetic: '/twelv/', meaning: '十二', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-13', word: 'bread', phonetic: '/bred/', meaning: '面包', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-14', word: 'my', phonetic: '/maɪ/', meaning: '我的', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-15', word: 'favourite', phonetic: '/ˈfeɪvərɪt/', meaning: '特别喜爱的', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-16', word: 'chicken', phonetic: '/ˈtʃɪkɪn/', meaning: '鸡肉', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-17', word: 'fish', phonetic: '/fɪʃ/', meaning: '鱼肉；鱼', unit: 7, unitName: 'Food We Like', semester: '下' },
  { id: 'd1-18', word: 'rice', phonetic: '/raɪs/', meaning: '米饭', unit: 7, unitName: 'Food We Like', semester: '下' },

  // ========== 下册 Unit 2 (Unit 8): My Day ==========
  { id: 'd2-1', word: 'breakfast', phonetic: '/ˈbrekfəst/', meaning: '早餐', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-2', word: 'egg', phonetic: '/eɡ/', meaning: '鸡蛋', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-3', word: 'juice', phonetic: '/dʒuːs/', meaning: '果汁', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-4', word: 'milk', phonetic: '/mɪlk/', meaning: '牛奶', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-5', word: 'hungry', phonetic: '/ˈhʌŋɡri/', meaning: '饥饿的', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-6', word: 'lunch', phonetic: '/lʌntʃ/', meaning: '午餐', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-7', word: 'noodle', phonetic: '/ˈnuːdl/', meaning: '面条', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-8', word: 'eat', phonetic: '/iːt/', meaning: '吃', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-9', word: 'water', phonetic: '/ˈwɔːtə/', meaning: '水', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-10', word: 'drink', phonetic: '/drɪŋk/', meaning: '喝', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-11', word: 'soup', phonetic: '/suːp/', meaning: '汤', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-12', word: 'dinner', phonetic: '/ˈdɪnə/', meaning: '正餐，主餐', unit: 8, unitName: 'My Day', semester: '下' },
  { id: 'd2-13', word: 'good', phonetic: '/ɡʊd/', meaning: '好的', unit: 8, unitName: 'My Day', semester: '下' },

  // ========== 下册 Unit 3 (Unit 9): My Room ==========
  { id: 'd3-1', word: 'get up', phonetic: '/ɡet ʌp/', meaning: '起床', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-2', word: 'make my bed', phonetic: '/meɪk maɪ bed/', meaning: '整理床铺', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-3', word: 'wash', phonetic: '/wɒʃ/', meaning: '洗', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-4', word: 'evening', phonetic: '/ˈiːvnɪŋ/', meaning: '晚上；傍晚', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-5', word: 'do', phonetic: '/duː/', meaning: '做；干', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-6', word: 'schoolbag', phonetic: '/ˈskuːlbæɡ/', meaning: '书包', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-7', word: 'put', phonetic: '/pʊt/', meaning: '放；置', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-8', word: 'clean', phonetic: '/kliːn/', meaning: '干净的；打扫', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-9', word: 'room', phonetic: '/ruːm/', meaning: '房间', unit: 9, unitName: 'My Room', semester: '下' },
  { id: 'd3-10', word: 'sock', phonetic: '/sɒk/', meaning: '短袜', unit: 9, unitName: 'My Room', semester: '下' },

  // ========== 下册 Unit 4 (Unit 10): On the Farm ==========
  { id: 'd4-1', word: 'farm', phonetic: '/fɑːm/', meaning: '农场', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-2', word: 'river', phonetic: '/ˈrɪvə/', meaning: '河；江', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-3', word: 'see', phonetic: '/siː/', meaning: '看见', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-4', word: 'horse', phonetic: '/hɔːs/', meaning: '马', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-5', word: 'cow', phonetic: '/kaʊ/', meaning: '奶牛', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-6', word: 'pig', phonetic: '/pɪɡ/', meaning: '猪', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-7', word: 'rabbit', phonetic: '/ˈræbɪt/', meaning: '兔', unit: 10, unitName: 'On the Farm', semester: '下' },
  { id: 'd4-8', word: 'sheep', phonetic: '/ʃiːp/', meaning: '绵羊；羊', unit: 10, unitName: 'On the Farm', semester: '下' },

  // ========== 下册 Unit 5 (Unit 11): Animals ==========
  { id: 'd5-1', word: 'animal', phonetic: '/ˈænɪml/', meaning: '动物', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-2', word: 'cat', phonetic: '/kæt/', meaning: '猫', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-3', word: 'dog', phonetic: '/dɒɡ/', meaning: '狗', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-4', word: 'duck', phonetic: '/dʌk/', meaning: '鸭子', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-5', word: 'bird', phonetic: '/bɜːd/', meaning: '鸟', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-6', word: 'monkey', phonetic: '/ˈmʌŋki/', meaning: '猴子', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-7', word: 'tiger', phonetic: '/ˈtaɪɡə/', meaning: '老虎', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-8', word: 'elephant', phonetic: '/ˈelɪfənt/', meaning: '大象', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-9', word: 'lion', phonetic: '/ˈlaɪən/', meaning: '狮子', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-10', word: 'bear', phonetic: '/beə/', meaning: '熊', unit: 11, unitName: 'Animals', semester: '下' },
  { id: 'd5-11', word: 'zoo', phonetic: '/zuː/', meaning: '动物园', unit: 11, unitName: 'Animals', semester: '下' },

  // ========== 下册 Unit 6 (Unit 12): Let's Play! ==========
  { id: 'd6-1', word: 'run', phonetic: '/rʌn/', meaning: '跑', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-2', word: 'jump', phonetic: '/dʒʌmp/', meaning: '跳', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-3', word: 'swim', phonetic: '/swɪm/', meaning: '游泳', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-4', word: 'fly', phonetic: '/flaɪ/', meaning: '飞', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-5', word: 'sing', phonetic: '/sɪŋ/', meaning: '唱歌', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-6', word: 'dance', phonetic: '/dɑːns/', meaning: '跳舞', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-7', word: 'draw', phonetic: '/drɔː/', meaning: '画画', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-8', word: 'read', phonetic: '/riːd/', meaning: '阅读', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-9', word: 'write', phonetic: '/raɪt/', meaning: '写', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-10', word: 'ball', phonetic: '/bɔːl/', meaning: '球', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-11', word: 'game', phonetic: '/ɡeɪm/', meaning: '游戏', unit: 12, unitName: "Let's Play!", semester: '下' },
  { id: 'd6-12', word: 'toy', phonetic: '/tɔɪ/', meaning: '玩具', unit: 12, unitName: "Let's Play!", semester: '下' },
];

// 辅助函数
export function getWordsByUnit(unitId: number): Word[] {
  return words.filter(w => w.unit === unitId);
}

export function getWordsBySemester(semester: '上' | '下'): Word[] {
  return words.filter(w => w.semester === semester);
}

export function getUnitById(unitId: number): Unit | undefined {
  return units.find(u => u.id === unitId);
}

export function getTotalWordCount(): number {
  return words.length;
}
