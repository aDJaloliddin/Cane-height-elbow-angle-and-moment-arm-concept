$(document).ready(function () {
  const MIN_CANE_HEIGHT_IN_INCH = 29;
  const MAX_CANE_HEIGHT_IN_INCH = 38;

  const TOP = 1;
  const BOTTOM = 0;

  const RIGHT = 1;
  const LEFT = 0;
  const ONE_INCH = 12; //  1 inch = 12px for this project in displaying values
  const UPPER_ARM_LENGTH = 100; // in pixels 96px
  const LOWER_ARM_LENGTH = 140; // in pixels 144px

  const DEFAULT_PERPENDICULAR_LENGTH = 36; // 2 inch = 24 px

  let alfa = null; // angel for upper arm
  let beta = null; //angel for lower arm
  let perpendicular = null;
  let prev_inch = null;

  let distance = 240; // in pixels

  function get_alfa() {
    return (
      (180 / Math.PI) *
      Math.acos(
        (distance ** 2 + UPPER_ARM_LENGTH ** 2 - LOWER_ARM_LENGTH ** 2) /
          (2 * distance * UPPER_ARM_LENGTH)
      )
    );
  }

  function get_beta() {
    return (
      (180 / Math.PI) *
      Math.acos(
        (distance ** 2 + LOWER_ARM_LENGTH ** 2 - UPPER_ARM_LENGTH ** 2) /
          (2 * distance * LOWER_ARM_LENGTH)
      )
    );
  }

  function get_elem_prop_val($elem, property) {
    //   this function gets css property of elemnt which ends with 'px'
    return Number($elem.css(property).slice(0, -2));
  }

  function move_elem($elem, inch = 1, direction = TOP) {
    if (direction) {
      $elem.css(
        "top",
        get_elem_prop_val($elem, "top") - inch * ONE_INCH + "px"
      );
    } else {
      $elem.css(
        "top",
        get_elem_prop_val($elem, "top") + inch * ONE_INCH + "px"
      );
    }
  }

  function rotate_elem($elem, angle, direction = RIGHT) {
    if (direction) {
      $elem.css("transform", `rotate(${angle}deg)`);
    } else {
      $elem.css("transform", `rotate(-${angle}deg)`);
    }
  }

  function get_perpendicular_length() {
    let perimetr = (distance + UPPER_ARM_LENGTH + LOWER_ARM_LENGTH) / 2;
    return (
      (2 / distance) *
      Math.sqrt(
        perimetr *
          (perimetr - distance) *
          (perimetr - UPPER_ARM_LENGTH) *
          (perimetr - LOWER_ARM_LENGTH)
      )
    );
  }

  const $upper_arm = $(".image__upper-arm");
  const $lower_arm = $(".image__lower-arm");
  const $top_cane = $(".image__top-cane");
  const $bottom_cane = $(".image__bottom-resizable-cane");

  function move_cane(inch = 1, direction = TOP) {
    if (direction) {
      distance -= inch * ONE_INCH;
    } else {
      distance += inch * ONE_INCH;
    }

    move_elem($top_cane, inch, direction);
    move_elem($lower_arm, inch, direction);

    rotate_elem($lower_arm, get_beta());
    rotate_elem($upper_arm, get_alfa(), LEFT);

    move_elem($bottom_cane, inch, direction);
    if (direction) {
      $bottom_cane.css(
        "height",
        get_elem_prop_val($bottom_cane, "height") + inch * ONE_INCH + "px"
      );
    } else {
      $bottom_cane.css(
        "height",
        get_elem_prop_val($bottom_cane, "height") - inch * ONE_INCH + "px"
      );
    }
  }

  $(".cane-height-slider").on("change", function () {
    let inch = Number($(this).val());

    if (inch >= MIN_CANE_HEIGHT_IN_INCH && inch < MAX_CANE_HEIGHT_IN_INCH) {
      inch -= MIN_CANE_HEIGHT_IN_INCH;
      if (inch > prev_inch) {
        move_cane(inch - prev_inch);
        move_elem($(".perpendicular-line"), (inch - prev_inch) / 2);
        prev_inch = inch;
      } else {
        move_cane(prev_inch - inch, BOTTOM);
        move_elem($(".perpendicular-line"), (prev_inch - inch) / 2, BOTTOM);
        prev_inch = inch;
      }

      $(".js-elbow-angle").text(18 * inch);
      $('.js-perpendicular').text(Math.ceil((DEFAULT_PERPENDICULAR_LENGTH + get_perpendicular_length())/ONE_INCH));

      $(".perpendicular-line").css(
        "width",
        DEFAULT_PERPENDICULAR_LENGTH + get_perpendicular_length() + "px"
      );
    }
  });
});
