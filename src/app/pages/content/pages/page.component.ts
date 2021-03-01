import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'page-table',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  search_text: string = '';
  stores: Array<any> = [];
  perPage = 10;
  currentPage = 1;
  totalCount;
  settings = {
    mode: 'external',
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        {
          name: 'edit',
          title: '<i class="nb-edit"></i>'
        },
        {
          name: 'delete',
          title: '<i class="nb-trash"></i>'
        }
      ]
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      code: {
        title: 'Page Code',
        type: 'string',
      },
      description: {
        title: 'Page Name',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          // console.log(row.description.name)
          if (row.description) {
            return row.description.name
          } else {
            return ''
          }
        }
      },
      friendlyUrl: {
        title: 'Page Url',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          // console.log(row.description.name)
          if (row.description) {
            return row.description.friendlyUrl
          } else {
            return ''
          }
        }
      }

    },
  };

  // request params
  params = {
    lang: this.storageService.getLanguage(),
    store: this.storageService.getMerchant(),
    count: this.perPage,
    page: 0
  };

  source: any = new LocalDataSource();
  tempData: Array<any> = [];
  loadingList = false;
  constructor(
    private crudService: CrudService,
    public router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private mScrollbarService: MalihuScrollbarService,
    private storeService: StoreService,
    private storageService: StorageService,
  ) {
    this.getStoreList()
    this.getPages()
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
  }
  getPages() {
    this.loadingList = true;

    this.params.page = this.currentPage - 1;
    this.crudService.get('/v1/private/content/pages', this.params)
      .subscribe(data => {
        this.source = data.items;
        this.tempData = data.items;
        this.totalCount = data.recordsTotal * data.totalPages
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      });
  }
  // search() {
  //   const val = this.search_text.toLowerCase();
  //   const temp = this.tempData.filter(function (d) {
  //     return d.name.toLowerCase().indexOf(val) !== -1 || !val ||
  //       d.code.toLowerCase().indexOf(val) !== -1 || !val ||
  //       d.path.toLowerCase().indexOf(val) !== -1 || !val;
  //   });
  //   this.source = temp;
  // }.
  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getPages();
  }
  addPages() {
    localStorage.setItem('contentpageid', '');
    this.router.navigate(['/pages/content/pages/add']);
  }
  onSelectStore(e) {
    this.params["store"] = e;
    this.getPages();
  }
  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);

    }

  }
  onEdit(event) {
    localStorage.setItem('contentpageid', event.data.code);
    this.router.navigate(['/pages/content/pages/add']);
  }
  onDelete(event) {

    // console.log(event);

    this.dialogService.open(ShowcaseDialogComponent, {
      context: 'Do you really want to remove this entity?'
      // context: {
      //   title: 'Are you sure!',
      //   body: 'Do you really want to remove this entity?'
      // },
    }).onClose.subscribe(res => {
      if (res) {
        this.loadingList = true;
        this.crudService.delete('/v1/private/content/' + event.data.id + '?id=' + event.data.id)
          .subscribe(data => {
            this.loadingList = false;
            this.toastr.success('Content page deleted successfully');
            this.getPages();
          }, error => {
            this.loadingList = false;
          });
      } else {
        this.loadingList = false;
      }
    });

  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
}
