export default {
  size: {
    width: 600,
    height: 800
  },
  boundary: {
    left: 60
  },
  tooltip: {
    formatter: `{a} <br/>{b} : {c} ({d}%)`
  },
  legend: {
    offset: {
      left: '10%',
      top: '5%'
    }
  },
  isDrawEventContainer: false,
  series: [{
    radius: '55%',
    title: '访问来源',
    center: ['50%', '50%'],
    data: [{
      name: '幽州',
      color: '#c23531',
      value: 1548
    }, {
      name: '荆州',
      color: '#2f4554',
      value: 535
    }, {
      name: '兖州',
      color: '#61a0a8',
      value: 510
    }, {
      name: '益州',
      color: '#d48265',
      value: 634
    }, {
      name: '西凉',
      color: '#91c7ae',
      value: 735
    }]
  }]
}