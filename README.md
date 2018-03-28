# eventwatcher-listener
a demo of watcher/listener mode like global event bus.

## how to use?
```bash
npm install eventwatcher-listener --save
```
```javascript
import Event from 'eventwatcher-listener';

// add listener(test) to default name space.
var eid1 = Event.listen('test', data => {
    console.log(data);
});
// add listener(test) to 'nameSpace' name space. 
var eid2 = Event.listen('test', data => {
    console.log(data * 2);
}, 'nameSpace');

// trigger event(test) in default name space.
Event.trigger('test', 100);                 //100
// trigger event(test) in 'nameSpace' name space.
Event.trigger('test', 200, 'nameSpace');    //400

// remove listener by id.
Event.remove(eid1);
// remove all listeners in default name space by event name(test).
Event.remove('test');
// remove all listeners in 'nameSpace' name space.
Event.remove('nameSpace');
// remove all listeners in 'nameSpace' name space by event name(test).
Event.remove('test', 'nameSpace');
```