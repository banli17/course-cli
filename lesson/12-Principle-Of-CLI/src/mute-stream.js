const MuteStream = require('mute-stream')

// example 1
// const ms = new MuteStream()
// ms.pipe(process.stdout)

// ms.write('foo') // 控制台打印 foo
// ms.mute()
// ms.write('bar') // 控制台不打印 bar
// ms.unmute()
// ms.write('baz') // 控制台打印 baz
// ms.write('\n')


// example 2
const ms = new MuteStream()
const input = process.stdin
input.pipe(ms)
ms.on('data', (c) => {
  console.log('data: ' + c)
})

input.emit('data', 'foo') // 控制台打印 foo
ms.mute()
input.emit('data', 'bar') // 控制台不打印 bar
ms.unmute()
input.emit('data', 'baz') // 控制台打印 baz
input.pause()
