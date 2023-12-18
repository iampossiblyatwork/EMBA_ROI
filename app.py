from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import locale
# Set the locale to the desired currency format
locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')  # Adjust the locale based on your currency



def calculate_tax(income):
    """
    Calculate tax based on income.

    Parameters:
    - income (float): The income amount.

    Returns:
    - float: The calculated tax amount.
    """
    if income <= 0:
        return 0  # No tax for negative or zero income

    brackets = [11600, 47150, 100525, 191950, 243725, 609350, float('inf')]
    rates = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]

    # Calculate tax based on income and tax brackets
    tax = 0
    for i in range(len(brackets)):
        # print("1","inc",income,"brack", brackets[i],"tax",tax,"it",i)
        if brackets[i] < income:
            tax += brackets[i] * rates[i]
            income -= brackets[i]
            continue
        elif 0 < income < brackets[i]:
            tax += income * rates[i]
            income -= income
            continue
        else:
            continue

    return tax

def growthrate(startingvalue,rate,intervals):
    rate = (rate/100)+1
    stop = startingvalue * rate ** (intervals - 1)
    values = np.geomspace(startingvalue, stop, intervals)
    values = np.around(values,2)
    return values

def format_currency(value):
    return '${:,.2f}'.format(value)
def exgrowthrate(old_startingvalue,startingvalue,rate,intervals,term):
    normalsalaryduringschool = growthrate(old_startingvalue, rate, term)
    rate = (rate/100)+1
    stop = startingvalue * rate ** (intervals - 1-term)
    values = np.geomspace(startingvalue, stop, intervals-term)
    expectedsalaries = np.append(normalsalaryduringschool, values)
    expectedsalaries = np.around(expectedsalaries, 2)
    return expectedsalaries

def tuitioncalc(dollars,years):
    tuitionperyear = -1*float(dollars/years)
    n = 0
    tl = []
    while (n < years):
        tl.append(tuitionperyear)
        n += 1

    return tl

def calculator(start, age, retire_age, current_salary, expected_salary, esalg,term, tuition ):
    index = range(age, retire_age + 1)
    df = pd.DataFrame(index=index)
    years = list(range(start, start + (retire_age + 1 - age)))
    df['Years'] = years
    df['Pre-MBA Salary'] = growthrate(current_salary, esalg, len(years))
    df['Post-MBA Salary'] = exgrowthrate(current_salary, expected_salary, esalg, len(years), term)
    print((tuitioncalc(tuition, term)))
    uneven_list = tuitioncalc(tuition, term)
    uneven_list += [float('nan')] * (len(df) - len(uneven_list))
    df['Tuition Cost'] = uneven_list
    df['Tuition Cost'].fillna(0, inplace=True)
    df['Delta'] = round(df['Post-MBA Salary'] - df['Pre-MBA Salary'] + df['Tuition Cost'], 2)
    df['Running Total'] = df['Delta'].cumsum()


    currency_columns = ['Pre-MBA Salary', 'Post-MBA Salary', 'Tuition Cost', 'Delta','Running Total']
    for column in currency_columns:
        df[column] = df[column].map('${:,.2f}'.format)

    print(df)
    return df

app = Flask(__name__,static_url_path='/static')

@app.route('/')
def index():
    return render_template('calculator.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        start = int(request.form['start'])
        age = int(request.form['age'])
        retire_age = int(request.form['retire'])
        current_salary = float(request.form['currentsalary'])
        expected_salary = float(request.form['expectedsalary'])
        esalg = float(request.form['esalg'])
        term = int(request.form['term'])
        tuition = float(request.form['tuition'])
        result_df = calculator(start, age, retire_age, current_salary, expected_salary, esalg, term, tuition)
        result_html = result_df.to_html()
        return render_template('results.html', result_html=result_html)




    except ValueError:
        return render_template('calculator.html', error="Invalid input. Please enter valid numbers.")

if __name__ == '__main__':
    app.run(debug=True)


