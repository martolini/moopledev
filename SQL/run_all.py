import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
for sql in os.listdir('/'):
	with open(BASE_DIR + sql, 'r') as sqlfile:
		os.system("mysql -u root -p -e '" + sqlfile.read() = "'")
		print "Executed {}".format(sql)