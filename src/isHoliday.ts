// 祝日または振替休日または国民の休日
export function isHolidayByDate(date: Date) {
  return isHoliday(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function isHoliday(year: number, month: number, day: number) {
  return isNationalHoliday(year, month, day) || isInLieu(year, month, day);
}
/*
現行の国民の祝日(2003年以降)は、大きく分けて3種類あって、
1:毎年同じ日付のもの
2:何月の第○☓曜日(ハッピーマンデー型)
3:春分の日、秋分の日 
*/
function isNationalHoliday(year: number, month: number, day: number) {
  // 計算を早くするために, 現時点(2014年)で祝日の無い6月と8月は処理を省く.
  if (month == 6) return false;
  if (year < 2016 && month == 8) return false;

  // 1:毎年同じ日付のもの
  if (
    (month == 1 && day == 1) || // １月１日     元旦
    (month == 2 && day == 11) || // ２月１１日   建国記念日
    (month == 4 && day == 29) || // ４月２９日   昭和の日
    (month == 5 && day == 3) || // ５月３日     憲法記念日
    (month == 5 && day == 4) || // ５月４日     みどりの日
    (month == 5 && day == 5) || // ５月５日     こどもの日
    (month == 5 && day == 6) || // ５月６日     振替休日 (ちょっとこれは自信無い. ダメかも)
    //|| month == 8 && day == 11    // ８月１１日   山の日 // 2016年以降
    (month == 11 && day == 3) || // １１月３日   文化の日
    (month == 11 && day == 23) || // １１月２３日  勤労感謝の日
    (month == 12 && day == 23) // １２月２３日  天皇誕生日
  ) {
    return true;
  }

  if (year >= 2016 && month == 8 && day == 11) {
    // 山の日
    return true;
  }

  // 2:何月の第○☓曜日(ハッピーマンデー型)
  const week = new Date(year, month - 1, day).getDay();
  const numberOfWeek = Math.floor((day - 1) / 7) + 1; // 第何週目か
  if (
    (month == 1 && week == 1 && numberOfWeek == 2) || // １月の第２日曜日 成人の日
    (month == 7 && week == 1 && numberOfWeek == 3) || // ７月の第３日曜日 海の日
    (month == 9 && week == 1 && numberOfWeek == 3) || // ９月の第３日曜日 敬老の日
    (month == 10 && week == 1 && numberOfWeek == 2) // １０月の第２日曜日 体育の日
  ) {
    return true;
  }

  // 3:春分の日、秋分の日
  if (
    (month == 3 &&
      day ==
        Math.floor(20.8431 + 0.242194 * (year - 1980)) -
          Math.floor((year - 1980) / 4)) ||
    (month == 9 &&
      day ==
        Math.floor(23.2488 + 0.242194 * (year - 1980)) -
          Math.floor((year - 1980) / 4))
  ) {
    return true;
  }
  return false;
}

// 振替休日判定
function isInLieu(year: number, month: number, day: number) {
  const week = new Date(year, month - 1, day).getDay();
  // 振替休日
  if (week == 1) {
    return isNationalHoliday(year, month, day - 1);
  }
  // 国民の祝日 (祝日と祝日に挟まれたら, その日も休日です)
  if (week != 0 && week != 6) {
    return (
      isNationalHoliday(year, month, day - 1) &&
      isNationalHoliday(year, month, day + 1)
    );
  }
}
