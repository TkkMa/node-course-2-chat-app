var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=>{
    it('should generate correct message object', () =>{
        var from = 'Terence';
        var text = 'This is some text';
        var message = generateMessage(from, text);
        
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,text});
    });
});

describe('generateLocationMessage', ()=>{
    it('should generate correct location object', () =>{
        var from = 'Admin';
        var latitude = 22;
        var longitude = 114;
        var url = `https://www.google.com/maps/?q=22,114`
        var message = generateLocationMessage(from, latitude, longitude);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from,url});
    })
})