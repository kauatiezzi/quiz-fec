var data = [
  {
    id: "",
    type: "allin",
    color: "#3f297e",
    text: "BATON",
    probability: 0.03,
  },
  { id: "", type: "quiz", color: "#1d61ac", text: "BIS", probability: 0.12 },
  {
    id: "",
    type: "quiz",
    color: "#169ed8",
    text: "GOMINHA",
    probability: 0.1,
  },
  { id: "", type: "quiz", color: "#209b6c", text: "BATON", probability: 0.03 },
  {
    id: "",
    type: "time",
    color: "#e6471d",
    text: "2x PIRULITO",
    probability: 0.11,
  },
  {
    id: "",
    type: "question",
    color: "#dc0936",
    text: "GOMINHA",
    probability: 0.05,
  },
  { id: "", color: "#e5177b", text: "NOVA CHANCE", probability: 0.1 },
  { id: "", color: "#2EFEC8", text: "4 BALAS", probability: 0.15 },
  { id: "", color: "#be107f", text: "PIRULITO", probability: 0.20 },
  { id: "", type: "replay", color: "#881f7e", text: "BIS", probability: 0.12 },
]

var RouletteWheel = function (el, items) {
  this.$el = $(el)
  this.items = items || []
  this._bis = false
  this._angle = 0
  this._index = 0
  this.options = {
    angleOffset: -90,
  }
}

_.extend(RouletteWheel.prototype, Backbone.Events)

RouletteWheel.prototype.spin = function () {
  var totalProbability = this.items.reduce(function (sum, item) {
    return sum + item.probability
  }, 0)

  var randomValue = Math.random() * totalProbability
  var accumulatedProbability = 0
  var selectedItem

  for (var i = 0; i < this.items.length; i++) {
    accumulatedProbability += this.items[i].probability
    if (randomValue <= accumulatedProbability) {
      selectedItem = this.items[i]
      break
    }
  }

  var index = this.items.indexOf(selectedItem)
  var count = this.items.length
  var delta = 360 / count
  var a = index * delta + (this._bis ? 1440 : -1440)

  this._bis = !this._bis
  this._angle = a
  this._index = index

  var $spinner = this.$el.find(".spinner")

  $spinner.velocity("stop").velocity(
    {
      rotateZ: a + "deg",
    },
    {
      easing: "easeOutQuint",
      duration: 5000,
      begin: () => {
        this.$el.addClass("busy")
        this.trigger("spin:start", this)
      },
      complete: () => {
        this.$el.removeClass("busy")
        this.trigger("spin:end", this)
      },
    }
  )
}

RouletteWheel.prototype.render = function () {
  var $spinner = this.$el.find(".spinner")
  var D = this.$el.width()
  var R = D * 0.5

  var count = this.items.length // Atualize o número de itens
  var delta = 360 / count // Recalcule o ângulo para cada item

  for (var i = 0; i < count; i++) {
    var item = this.items[i]
    var color = item.color
    var text = item.text
    var ikon = item.ikon

    var html = []
    html.push('<div class="item" ')
    html.push('data-index="' + i + '" ')
    html.push('data-type="' + item.type + '" ')
    html.push(">")
    html.push('<span class="label">')
    if (ikon) html.push('<i class="material-icons">' + ikon + "</i>")
    html.push('<span class="text">' + text + "</span>")
    html.push("</span>")
    html.push("</div>")

    var $item = $(html.join(""))
    var borderTopWidth = D + D * 0.0025
    var deltaInRadians = (delta * Math.PI) / 180
    var borderRightWidth = D / (1 / Math.tan(deltaInRadians))
    var r = delta * (count - i) + this.options.angleOffset - delta * 0.5

    $item.css({
      borderTopWidth: borderTopWidth,
      borderRightWidth: borderRightWidth,
      transform: "scale(2) rotate(" + r + "deg)",
      borderTopColor: color,
    })

    var textHeight = parseInt(((2 * Math.PI * R) / count) * 0.5)

    $item.find(".label").css({
      transform:
        "translateY(" +
        D * -0.25 +
        "px) translateX(" +
        textHeight * 1.03 +
        "px) rotateZ(" +
        (90 + delta * 0.5) +
        "deg)",
      height: textHeight * 0.8 + "px", // Reduza a altura do texto
      lineHeight: textHeight * 0.8 + "px", // Reduza o lineHeight
      textIndent: R * 0.1 + "px",
    })

    $spinner.append($item)
  }

  $spinner.css({
    fontSize: parseInt(R * 0.06) + "px",
  })
}

RouletteWheel.prototype.bindEvents = function () {
  this.$el.find(".button").on("click", () => this.spin())
}

var spinner
$(window).on("load", function () {
  spinner = new RouletteWheel($(".roulette"), data)
  spinner.render()
  spinner.bindEvents()

  spinner.on("spin:start", function (r) {
    console.log("spin start!")
  })
  spinner.on("spin:end", function (r) {
    console.log("spin end! -->" + r._index)
  })
})

RouletteWheel.prototype.showPrize = function (prize) {
  var modal = document.getElementById("prizeModal")
  var span = document.getElementsByClassName("close")[0]
  var prizeText = document.getElementById("prizeText")

  prizeText.innerText = "Você ganhou: " + prize

  modal.style.display = "block"

  span.onclick = function () {
    modal.style.display = "none"
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }
}

// Atualize a função que lida com o final do giro para exibir o modal
RouletteWheel.prototype.spin = function () {
  var totalProbability = this.items.reduce(function (sum, item) {
    return sum + item.probability
  }, 0)

  var randomValue = Math.random() * totalProbability
  var accumulatedProbability = 0
  var selectedItem

  for (var i = 0; i < this.items.length; i++) {
    accumulatedProbability += this.items[i].probability
    if (randomValue <= accumulatedProbability) {
      selectedItem = this.items[i]
      break
    }
  }

  var index = this.items.indexOf(selectedItem)
  var count = this.items.length
  var delta = 360 / count
  var a = index * delta + (this._bis ? 1440 : -1440)

  this._bis = !this._bis
  this._angle = a
  this._index = index

  var $spinner = this.$el.find(".spinner")

  $spinner.velocity("stop").velocity(
    {
      rotateZ: a + "deg",
    },
    {
      easing: "easeOutQuint",
      duration: 5000,
      begin: () => {
        this.$el.addClass("busy")
        this.trigger("spin:start", this)
      },
      complete: () => {
        this.$el.removeClass("busy")
        this.trigger("spin:end", this)
        this.showPrize(selectedItem.text) // Exibir o prêmio
      },
    }
  )
}

RouletteWheel.prototype.showPrize = function (prize) {
  var modal = document.getElementById("prizeModal")
  var span = document.getElementsByClassName("close")[0]
  var prizeText = document.getElementById("prizeText")

  prizeText.innerText = "Seu prêmio é um(a): " + prize

  modal.style.display = "block"

  span.onclick = function () {
    modal.style.display = "none"
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }
}

// Atualize a função que lida com o final do giro para exibir o modal
RouletteWheel.prototype.spin = function () {
  var totalProbability = this.items.reduce(function (sum, item) {
    return sum + item.probability
  }, 0)

  var randomValue = Math.random() * totalProbability
  var accumulatedProbability = 0
  var selectedItem

  for (var i = 0; i < this.items.length; i++) {
    accumulatedProbability += this.items[i].probability
    if (randomValue <= accumulatedProbability) {
      selectedItem = this.items[i]
      break
    }
  }

  var index = this.items.indexOf(selectedItem)
  var count = this.items.length
  var delta = 360 / count
  var a = index * delta + (this._bis ? 1440 : -1440)

  this._bis = !this._bis
  this._angle = a
  this._index = index

  var $spinner = this.$el.find(".spinner")

  $spinner.velocity("stop").velocity(
    {
      rotateZ: a + "deg",
    },
    {
      easing: "easeOutQuint",
      duration: 5000,
      begin: () => {
        this.$el.addClass("busy")
        this.trigger("spin:start", this)
      },
      complete: () => {
        this.$el.removeClass("busy")
        this.trigger("spin:end", this)
        this.showPrize(selectedItem.text) // Exibir o prêmio
      },
    }
  )
}
