import 'dart:async';
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: ' Picture Frame',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: PictureFrame(),
      debugShowCheckedModeBanner: false, // Remove the debug banner
    );
  }
}

class PictureFrame extends StatefulWidget {
  @override
  _PictureFrameState createState() => _PictureFrameState();
}

class _PictureFrameState extends State<PictureFrame> {
  final List<String> _imageUrls = [
    'https://sarabblab.s3.amazonaws.com/im1.jpg',
    'https://sarabblab.s3.amazonaws.com/img2.jpg',
    'https://sarabblab.s3.amazonaws.com/img3.jpg',
    'https://sarabblab.s3.amazonaws.com/logo.jpg',
  ];

  int _currentIndex = 0;
  bool _isPaused = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startImageRotation();
  }

  void _startImageRotation() {
    _timer = Timer.periodic(Duration(seconds: 10), (Timer timer) {
      if (!_isPaused) {
        _nextImage();
      }
    });
  }

  void _nextImage() {
    setState(() {
      _currentIndex = (_currentIndex + 1) % _imageUrls.length;
    });
  }

  void _togglePauseResume() {
    setState(() {
      _isPaused = !_isPaused;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(' Picture Frame'),
      ),
      body: Center(
        child: Container(
          width: 300,
          height: 200,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.black, width: 8),
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                spreadRadius: 2,
                blurRadius: 7,
                offset: Offset(0, 3),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              _imageUrls[_currentIndex],
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _togglePauseResume,
        tooltip: _isPaused ? 'Resume' : 'Pause',
        child: Icon(_isPaused ? Icons.play_arrow : Icons.pause),
      ),
    );
  }
}
