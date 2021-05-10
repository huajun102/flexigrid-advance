
function replaceBtn(html){
	return html;
	html = html.replace(/class=("|')/g,"class=$1op-window ")
	if(!parent.layer){
		html = html.replace(/href=("|')/g,"class='op-window' op-max='true' op-title='操作窗口' op-url=$1")
	}else{
		html = html.replace(/href=("|')/g,"class='op-window' op-title='操作窗口' op-url=$1")
	}
	return html
}
var GridVM;
(function($,Vue){
	GridVM = new Vue({
		data(){
			return {
				url:'',
				formSearch:{},
				tableData:[],
				tableKey:'id',
				selectedKey:'',
				pager:{
					currentPage:1,
					pageSize:30,
					total:0
				},
				isLoading:false,
			}
		},
		created(){
			//this.loadData()
			window.addEventListener('keyup', function(event) {
				let key = event.keyCode;
				event.preventDefault();
				//事件中keycode=13为回车事件
				if (key === 13) {
					GridVM.loadData();
				}
			});
		},
		methods:{
			onShow(){
				this.loadData()
			},
			loadData(url){
				if(!this.url && !url){
					return;
				}
				let getUrl = this.url
				if(url){
					getUrl = url;
				}else{
					for(let i in this.formSearch){
						if(this.formSearch[i]!==''){
							getUrl+=`&${i}=${this.formSearch[i]}`
						}
					}
				}
				getUrl+=`&curpage=${this.pager.currentPage}&rp=${this.pager.pageSize}`
				this.isLoading = true
				axios.get(getUrl).then(res=>{
					this.isLoading = false
					//console.log(this.tableData)
					if(res.data.code==200){
						let list = [];
						for(let i in res.data.data.list){
							list.push(res.data.data.list[i])
						}
						this.tableData = list
						this.pager.currentPage = res.data.data.now_page
						this.pager.total = res.data.data.total_num
					}else{
						this.$message.error(res.data.data.msg)
					}
				})
			},
			clearFormSearch(){
				for(let i in this.formSearch){
					this.formSearch[i] = ''
				}
				this.loadData()
			},
			handleSizeChange(val){
				this.pager.pageSize = val
				this.loadData()
			},
			handleCurrentChange(val){
				this.pager.currentPage = val
				this.loadData()
			},
			handleClick(name){
				console.log(name)
				if(name){
					eval(name+'()')
				}
			},
			handleSelectionChange(list){
				this.selectedKey = ''
				let kv = [];
				let kvEle = '';
				//移除所有勾选操作
				$('.trSelected').remove();
				/*for(let ii in this.tableData){
					this.$set(this.tableData[ii],'trSelected','')
				}*/
				for(let i in list){
					let keyVal = list[i][this.tableKey]
					/*for(let ii in this.tableData){
						if(keyVal == this.tableData[ii][this.tableKey]){
							this.$set(this.tableData[ii],'trSelected','trSelected')
						}
					}*/
					if(keyVal){
						kv.push(keyVal)
						kvEle+="<i data-id='"+keyVal+"' class='trSelected' style='display: none;'></i>";
					}
				}
				this.selectedKey = kv.join(',')
				//设置勾选
				$('#grid-app').after(kvEle);
				console.log(this.selectedKey,kvEle)
			},
			handleColClick(row,index,callback){
				//console.log(row,index,callback)
				if(callback){
					let obj = JSON.stringify(row)
					let call = `(${callback})`+`(${obj},${index})`
					//console.log(call)
					eval(call)
				}
			},
			handleColDbclick(index){
				this.$set(this.tableData[index],'editing',true)
				console.log(this.tableData[index].editing)
			},
			handleColEditCallback(row,col,index,callback){
				this.$set(this.tableData[index],'editing',false)
				console.log(this.tableData[index].editing)
				if(callback){
					let obj = JSON.stringify(row)
					let value = this.tableData[index][col];
					if(!value){
						value = ''
					}
					let call = callback+`(${obj},'${col}','${value}',${index})`;
					//console.log(call)
					eval(call)
				}
			},
			httpBtn(e){
				//console.log(e.target)
				let url = e.target.getAttribute('op-url')
				if(url){
					let max=true;
					if(parent.layer){
						max=false
					}
					openFormWin(e.target.getAttribute('op-title'),url,null,max)
				}
			},
		},
		filters:{
		}
	})
	$.fn.flexigrid = function(p) {
		if(!p.colModel){
			let cols=[];
			$('.flex-table thead th').each(function(index,ele){
				//console.log(ele,index)
				if(!$(ele).hasClass('sign')){
					if(!$(ele).hasClass('handle')){

						let text = trim($(ele).text())
						cols.push({display:text?text:'-',name:'col_'+index, isKey : $(ele).attr('key')})
					}else{
						cols.push({display:'操作',name:'operation'})
					}
				}
			})
			let tableData = [];
			$('.flex-table tbody tr').each(function(index,tr){
				//console.log(tr,index)
				let child = $(tr).children('td')
				let col = {}
				$(child).each(function(index,ele){
					if(!$(ele).hasClass('sign')){
						let html = trim($(ele).html())
						if(!$(ele).hasClass('handle')){
							col['col_'+index] = html;
						}else{
							col['operation'] = html;
						}
					}
				})
				tableData.push(col)
			})
			$('.flex-table').hide()
			//console.log(cols,tableData)
			GridVM.tableData = tableData;
			GridVM.pager.total = tableData.length;
			p.colModel = cols
		}
		var formSearch={};
		var template = `<style>
.el-popover span.btn em{display: none !important;} 
.el-popover i.fa{font-size: 12px;vertical-align: initial;} 
.el-popover a{line-height: 32px;color:dodgerblue;cursor: pointer;display: block;padding-left:10px;} 
.el-popover a.red{line-height: 32px;color:red;cursor: pointer;padding-left:10px;}
.el-popover a:hover{color:#fff;background: orangered;}
table img{ height: 30px; width: 30px; border-radius: 25px; object-fit: cover; float:left;}
.el-form{padding-top: 5px;display: inline-block}
.el-form--inline .el-form-item__content{max-width:220px;}
</style>
<div id="grid-app">`;
		if(p.colModel){
			template+=`<el-form :inline="true">`
			for(let i in p.searchitems){
				let input = '';
				switch (p.searchitems[i].type) {
					case 'select':
						input=`<el-select size="small" v-model="formSearch.${p.searchitems[i].name}"><el-option label="不限" value=""></el-option>`
						let options = p.searchitems[i].options;
						for(let ii in options){
							input+=`<el-option label="${options[ii].label}" value="${options[ii].value}"></el-option>`
						}
						input+=`</el-select>`
						break;
					case 'date':
						input=`<el-date-picker
v-model="formSearch.${p.searchitems[i].name}"
type="date"
value-format="timestamp"
placeholder="选择时间">
</el-date-picker>`;
						break;
					case 'datetime':
						input=`<el-date-picker
v-model="formSearch.${p.searchitems[i].name}"
type="datetime"
value-format="timestamp"
placeholder="选择时间">
</el-date-picker>`;
						break;
					case 'daterange':
						input=`<el-date-picker
v-model="formSearch.${p.searchitems[i].name}"
size="small"
type="datetimerange"
align="right"
start-placeholder="起始时间"
end-placeholder="截止时间"
range-separator="-"
value-format="timestamp"
:default-time="['00:00:00', '23:59:59']">
</el-date-picker>`
						break;
					default:
						input = `<el-input placeholder="请输入${p.searchitems[i].display}" size="small" v-model="formSearch.${p.searchitems[i].name}"></el-input>`
						break;
				}
				formSearch[p.searchitems[i].name]='';
				template+=`<el-form-item label="${p.searchitems[i].display}" style="float:left;margin-right:10px;" >
                ${input}
            </el-form-item>`;
			}
			template+=`</el-form>`
			let hasSearch = p.searchitems && p.searchitems.length>0;
			let hasButton = p.buttons && p.buttons.length>0;
			if(hasSearch || hasButton){
				template+=`<hr style="border: 1px solid #F36F20;">`;
			}
			if(hasSearch){
				template+=`<el-button-group>`
				template += `<el-button size="small" type="primary" @click="loadData()">查询</el-button>
<el-button size="small" type="default" @click="clearFormSearch()">重置</el-button>`;
				template+=`</el-button-group>`;
			}
			if(hasButton){
				template+=`<el-button-group style="margin-left: 15px;">`
				for(let i in p.buttons){
					let obj = p.buttons[i];
					template+=`<el-button size="small" onclick="${obj.onpress.name}('${obj.name}')">${obj.display}</el-button>`;
				}
				template+=`</el-button-group>`;
			}
			if(hasSearch || hasButton){
				template+=`<hr style="border: 1px solid  #F36F20;">`;
			}

			if(!p.width){
				p.width = '100%';
			}else{
				p.width += 'px';
			}
			if(!p.height){
				p.height = 1080;
			}
			template+=`<el-table :data="tableData" border stripe style="width:${p.width}" height="${p.height}" v-loading="isLoading" @selection-change="handleSelectionChange">`;
			template+=`<el-table-column type="selection" fixed="left"></el-table-column>`;
			for(let i in p.colModel){
				let fixed = ''
				if(i<=2){
					fixed = ' fixed="left" '
				}
				let width = p.colModel[i].width || 80
				let content = 'scope.row.'+p.colModel[i].name
				if(p.colModel[i].name=='operation'){
					fixed  = ' fixed="right" '
					template+=`<el-table-column label="${p.colModel[i].display}" prop="scope.row.${p.colModel[i].name}" width="${width}" align="center" ${fixed}>
<template slot-scope="scope">
<el-popover
  title="请选择操作"
  placement="left"
  width="80"
  trigger="hover">
  <div @click="httpBtn($event)" v-html="replaceBtn(${content})"></div>
  <el-button slot="reference" size="small" type="primary" plain>操作</el-button>
</el-popover>
</template>
</el-table-column>`;
				}else{
					let sortable = p.colModel[i].sortable?' sortable ':'';
					//console.log(p.colModel[i].name,p.colModel[i].isKey)
					if(p.colModel[i].isKey){
						GridVM.tableKey = p.colModel[i].name
						template+=`<el-table-column label="${p.colModel[i].display}" prop="scope.row.${p.colModel[i].name}" width="${width}" align="center" ${fixed} ${sortable}>
<div :data-id="${content}" :class="scope.row.trSelected" slot-scope="scope" v-html="${content}?${content}:'-'"></div>
</el-table-column>`;
					}else{
						let col_content = `<div slot-scope="scope" v-html="${content}?${content}:'-'"></div>`;
						let _edit_callback = p.colModel[i].edit_callback;
						if(_edit_callback){
							let type = p.colModel[i].type?p.colModel[i].type:'text'
							width = 180;
							col_content=`<template slot-scope="scope"><el-input v-model="scope.row.${p.colModel[i].name}" @focus="handleColDbclick(scope.$index)" @blur="handleColEditCallback(scope.row,'${p.colModel[i].name}',scope.$index,'${_edit_callback.name}')" :readonly="!scope.row.editing" placeholder="请输入${p.colModel[i].display}" title="点击进入编辑" type="${type}" >
<el-button size="small" v-show="scope.row.editing" @click="">保存</el-button>
</el-input></template>`;
						}
						template+=`<el-table-column label="${p.colModel[i].display}" prop="scope.row.${p.colModel[i].name}" width="${width}" align="center" ${fixed} ${sortable}>
${col_content}
</el-table-column>`;
					}

				}
			}
			//前端自定义按钮
			if(p.colButtons){
				let fixed  = ' fixed="right" '
				template+=`<el-table-column label="列操作"  width="200" align="center" ${fixed}>`
				template+=`<el-button-group slot-scope="scope">`
				for(let i in p.colButtons){
					let button  = p.colButtons[i];
					template+=`<el-button type="default" size="small"  @click="handleColClick(scope.row,scope.$index,'${button.callback.name}')">${button.display}</el-button>`;

				}
				template+=`</el-button-group>`
				template+=`</el-table-column>`;
			}
			template+=`</el-table>`;
			template+=`
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="pager.currentPage"
						:page-size="pager.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="pager.total">
				</el-pagination>`;
			template+=`</div>`
			$(this).after(template)
			GridVM.formSearch = formSearch
			GridVM.url = p.url
			if(!p.pageSize){
				p.pageSize = 10
			}
			GridVM.pager.pageSize = p.pageSize
			GridVM.$mount('#grid-app')
			if(GridVM.url){
				GridVM.loadData()
			}

		}


	}; //end flexigrid

	$.fn.flexReload = function(p) { // function to reload grid
		GridVM.loadData(p)

	}; //end flexReload

	$.fn.flexOptions = function(p) { //function to update general options

		GridVM.url = p.url
		return this
	}; //end flexOptions

	$.fn.flexToggleCol = function(cid,visible) { // function to reload grid


	}; //end flexToggleCol

	$.fn.flexAddData = function(data) { // function to add data to grid

		GridVM.tableData.push(data)

	};

	$.fn.noSelect = function(p) { //no select plugin by me :-)



	}; //end noSelect
	$.fn.flexSimpleSearchQueryString = function() {
		let getUrl = GridVM.url.replace('op=','oldop=')
		for(let i in GridVM.formSearch){
			if(GridVM.formSearch[i]!==''){
				getUrl+=`&${i}=${GridVM.formSearch[i]}`
			}
		}
		return getUrl
	};

})(jQuery,Vue);
