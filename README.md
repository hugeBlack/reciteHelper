# reciteHelper
古诗文背诵助手<br/>
没什么用的样子2333<br/>
诗词库在/jss/poemInfo.json里，使用json格式示例：
```
    {
        "name": "test",//文章标题
        "content": [
            {"text":"sentnce1A_Head,","pos":"head"},//text里是每一句话，约定标点在最后。
            {"text":"sentnce1B_End.","pos":"end"},//pos有4种，head、mid、end、impossible
            {"text":"sentnce2A_Head,","pos":"head"},//分别代表：首句，中句、尾句、不可能考的句子
            {"text":"sentnce2B_Mid,","pos":"mid"},
            {"text":"sentence2C_Impossible,","pos":"impossible"},
            {"text":"sentence2D_End.","pos":"end"}
        ]
    }
```