import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    private dbName: string;
    private store: { [key: string]: any };
    private storage: WindowLocalStorage | WindowSessionStorage;

    constructor(name: string, type: string) {
        this.dbName = name;
        this.storage = window[type];
    }

    switchTo(type: string) {
        if (type) {
            this.storage = window[type];
        }
    }

    set(name: string, data) {
        let localData = this.storage['getItem'](this.dbName);
        if (localData) {
            this.store = JSON.parse(localData);
        } else {
            this.store = {};
        }
        this.store[name] = data;
        this.storage['setItem'](this.dbName, JSON.stringify(this.store));
    }

    get(name?: string) {
        let data = JSON.parse(this.storage['getItem'](this.dbName));
        if (!data) return undefined;
        if (name) {
            if (data[name]) {
                return data[name];
            } else {
                return {};
            }
        }
        return data;    // altrimenti ritorna tutto
    }

    clear(name?: string) {
        let localData = this.storage['getItem'](this.dbName);
        if (localData && name) {
            this.store = JSON.parse(localData);
            delete this.store[name];
            this.storage['setItem'](this.dbName, JSON.stringify(this.store))
            return;
        }
        this.storage['clear']();    // altrimenti cancella tutto
    }
}