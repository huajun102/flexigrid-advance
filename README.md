# flexigrid-advance
There are several old projects in each coder's hand, but they feel unable to change their skins because of too many modifications. There are also some things that can't be abandoned if they want to use the new framework. Now this plug-in can perfectly make the list of projects bigger and bigger. It supports batch check, supports automatic generation of search box for each project, brings its own search and reset buttons, and can add custom buttons at the top, Column operation buttons can be customized, and the original HTML buttons can be arranged into pop-up and drop-down button combinations.
<hr>
每个码农的手里多少有几个老项目，想换皮却因修改太多感到力不从心，想用新框架又有些不可舍弃的东西，现在这款插件可完美地让项目中的列表变得高大上，支持批量勾选，支持每条自动生成搜索框，自带搜索、重置按钮，可在顶部添加自定义按钮，可自定义列操作按钮，可将原有html按钮排成弹出下拉按钮组合。
<hr>

# Let's start
Depended on libs bellow
<ol>
    <li>vue</li>
    <li>element-ui</li>
    <li>jquery</li>
</ol>
How to use?
<pre>
$("#flexigrid").flexigrid({
    //--ajax path
    url: './data/member.json?t=1&curpage=1',
    pageSize:10,
    //--width:600,
    height:600,
    //--columns
    colModel : [],
    buttons:[],
    searchitems:[],
    colButtons:[],
})
</pre>
See more on document `index.html`

# Preview of other version
![image](https://user-images.githubusercontent.com/14683456/117626785-0c121380-b1aa-11eb-90fc-eef43e48c06d.png)
# Preview of this version
![image](https://user-images.githubusercontent.com/14683456/117626919-3663d100-b1aa-11eb-9f51-3ca8e814bc7e.png)

#TODO
实现一键弹出添加/编辑表单的单页面对话框

