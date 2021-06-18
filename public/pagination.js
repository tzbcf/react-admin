class Pagination {
    constructor(options) {
        this.options = options;
        console.log('-------', this.options);
        this.getData( () => {
            this.initDom();
        })
    }
    initDom(){
        const {container} = this.options;
        if (typeof container !== 'string' && !container) {
            console.warn('Please enter the mount DOM');
            return;
        }
        this.pageDom = $(`<div id="pagePlugins"></div>`);
        this.initPrevDom();
        this.initIndexDom();
        this.initNextDom();
        this.disabledEvent();
        $(container).append($(this.pageDom));
        this.initEvent();
    }
    initPrevDom() {
        this.prevDom = $(`<div class="pageItem" id="pagePrev"><span class="pageLink">&laquo;</span></div> `);
        this.pageDom.append(this.prevDom);
    }
    initNextDom(){
        this.nextDom = $(`<div class="pageItem" id="nextPrev"><span class="pageLink">&raquo;</span></div> `);
        this.pageDom.append(this.nextDom);
    }
    initIndexDom(){
        this.ulIndexDom = $(`<ul></ul>`);
        this.computeIndexLiDom();
        this.pageDom.append(this.ulIndexDom);
    }
    initEvent(){
        $("#pagePrev").click( () => {
            if (this.options.page > 1) {
                this.options.page = this.options.page - 1;
                this.getData();
            }
        })
        $("#nextPrev").click( () =>  {
            const {total,rows,page} = this.options;
            if (page !== this.numberCeil(total/rows) ) {
                this.options.page = page + 1;
                this.getData();
            }
        })
        $("#pagePlugins .pageIndex").click( () => {
            const index = $(this).index();
            alert(index);
        })
    }
    getData(){
        const {url,method='Get',data={},page=1,rows=20} = this.options;
        const self = this;
        if (!url) {
            console.warn('Please enter url');
            return;
        }
        const params = {page,rows,...data}
        $.ajax({
            url: url,
            type: method,
            data: params,
            dataType: 'json',
            async: false,
            success (data, textStatus) {
                console.log('data----data----',data)
                if (!self.pageDom) {
                    self.initDom()
                } else {
                    self.options.total = data.total;
                    self.disabledEvent();
                    self.changeIndexDom();
                    self.initEvent();
                    self.options.callback(data);
                }
            },
            error:function(error){
                console.warn(error);
            }
        })
    }
    disabledEvent(){
        const {page=1,total=0,rows=20} = this.options;
        if (page === 1) { // 上一页按钮禁用
            this.prevDom.attr('disabled', 'true');
            this.prevDom.addClass('disabled');
        }
        if (page > 1) { // 上一页按钮不禁用
            this.prevDom.attr('disabled', 'false');
            this.prevDom.removeClass('disabled');
        }
        console.log('-------',this.numberCeil(total/rows))
        console.log('-------',page === this.numberCeil(total/rows))
        if (page === this.numberCeil(total/rows)) { // 下一页按钮禁用
            this.nextDom.attr('disabled', 'true');
            this.nextDom.addClass('disabled');
        }
        if (page < this.numberCeil(total/rows)) { // 下一页不禁用
            this.nextDom.attr('disabled', 'false');
            this.nextDom.removeClass('disabled');
        }
    }
    numberCeil(num){
        if (!num) {
            return 1;
        } else {
            return Math.ceil(num)
        }
    }
    changeIndexDom(){
        this.ulIndexDom.children().remove();
        this.computeIndexLiDom();
    }
    computeIndexLiDom(){
        const {total=0,rows=20,page=1} = this.options;
        let {maxIndex=5} = this.options;
        if (this.numberCeil(total/rows) < maxIndex+page-1) {
            maxIndex = total/rows + 1;
        } else {
            maxIndex = maxIndex + page - 1;
        }
        for (let i=page;i<=maxIndex;i++){
            this.ulIndexDom.append(`<li class="pageItem pageIndex"><span class="pageLink">${i}</span></li>`)
        }
    }
    search(params){
        this.options.page = 1;
        this.options.data = params;
        this.getData()
        console.log('seacrch----')
    }
}